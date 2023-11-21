from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import sys
import pyaudio
import numpy as np
import audioop
import wave
import tensorflow as tf
import time
from jetbot import Robot

FLAGS = None
IN_FILE = 'in.wav' # name of input file
CHUNK = 4096 # number of data points to read at a time
RATE = 16000 # time resolution of the recording device (Hz)
CHANNELS = 1 # number of channels

FORMAT = pyaudio.paInt16 # audio format from pyaudio
p=pyaudio.PyAudio() # start the PyAudio class
devinfo = p.get_device_info_by_index(0) # get the first recorder device
robot = Robot() # robot object to control JetBot

# choose robot action based on string
function_chooser = {'left': robot.left, 'right': robot.right, 'go': robot.forward, 'down': robot.backward}


# stream from pyaudio
stream=p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True,
              frames_per_buffer=CHUNK)


def load_graph(filename):
    """Unpersists graph from file as default graph."""
    with tf.io.gfile.GFile(filename, 'rb') as f:
        graph_def = tf.compat.v1.GraphDef()
        graph_def.ParseFromString(f.read())
        tf.import_graph_def(graph_def, name='')


def load_labels(filename):
    """Read in labels, one label per line."""
    return [line.rstrip() for line in tf.io.gfile.GFile(filename)]


def run_graph(wav_data, labels, input_layer_name, output_layer_name,
              num_top_predictions):
  """Runs the audio data through the graph and prints predictions."""
  with tf.compat.v1.Session() as sess:
    # Feed the audio data as input to the graph.
    #   predictions  will contain a two-dimensional array, where one
    #   dimension represents the input image count, and the other has
    #   predictions per class
    softmax_tensor = sess.graph.get_tensor_by_name(output_layer_name)
    predictions, = sess.run(softmax_tensor, {input_layer_name: wav_data})

    # Sort to show labels in order of confidence
    top_k = predictions.argsort()[-num_top_predictions:][::-1]
    for node_id in top_k:
        human_string = labels[node_id]
        score = predictions[node_id]
        print('%s (score = %.5f)' % (human_string, score))

    return 0


def label_wav(wav, labels, graph, input_name, output_name, how_many_labels):
    """Loads the model and labels, and runs the inference to print predictions."""
    if not wav or not tf.io.gfile.exists(wav):
        tf.compat.v1.logging.fatal('Audio file does not exist %s', wav)

    if not labels or not tf.io.gfile.exists(labels):
        tf.compat.v1.logging.fatal('Labels file does not exist %s', labels)

    if not graph or not tf.io.gfile.exists(graph):
        tf.compat.v1.logging.fatal('Graph file does not exist %s', graph)

    labels_list = load_labels(labels)

    # load graph, which is stored in the default session
    load_graph(graph)

    with open(wav, 'rb') as wav_file:
        wav_data = wav_file.read()

    run_graph(wav_data, labels_list, input_name, output_name, how_many_labels)


def prepare(graph, labels):
    """Loads data labels and tensor graphs"""
    labels_list = load_labels(labels)
    load_graph(graph)
    return labels_list

def main(_):

    # initialize variables and prepare graph
    labels = prepare(FLAGS.graph, FLAGS.labels)
    recording = False
    frames = []
    time_from_previous = 0

    with tf.compat.v1.Session() as sess:

        # loads softmax tensor
        softmax_tensor = sess.graph.get_tensor_by_name(FLAGS.output_name)

        while True:
            # transform data into a numpy array
            data = np.fromstring(stream.read(CHUNK), dtype=np.int16)

            # get audio rms
            rms = audioop.rms(data, 2)

            # if audio rms reaches 900 or more set recording for true
            # and start appending the data into the frames array.

            # this means someone is talking 
            if rms > 900: 
                if recording == False:
                    recording = True
                frames.append(data)
            else:
                if recording == True:
                    time_from_previous = time.time()

                    # get data from stream for the next 0.5 seconds
                    # after the volume 
                    while time.time() - time_from_previous < 0.5:
                        data = np.fromstring(stream.read(CHUNK),dtype=np.int16)
                        frames.append(data)

                    # write frames inside wav file
                    _file = wave.open("out.wav","wb")
                    _file.setnchannels(CHANNELS)
                    _file.setsampwidth(p.get_sample_size(FORMAT))
                    _file.setframerate(RATE)
                    _file.writeframes(b''.join(frames))
                    _file.close()

                    # clear frames array since the data was
                    # written inside wav file
                    frames = []

                    # read wav file to get the input data for
                    # our neural network
                    with open('out.wav', 'rb') as wav_file:
                        wav_data = wav_file.read()
                    
                    # this is where the model predicts based on the input data
                    predictions, = sess.run(softmax_tensor, {FLAGS.input_name: wav_data})

		            # Sort to show labels in order of confidence
                    top_k = predictions.argsort()[-FLAGS.how_many_labels:][::-1]
                    for node_id in top_k:
                        human_string = labels[node_id]
                        score = predictions[node_id]
                        if human_string in ['left', 'right', 'go', 'down']:

                            # run robot action
                            function_chooser[human_string](velocity=0.3)
                            time.sleep(0.5)
                            robot.stop()
                            
                        print('%s (score = %.5f)' % (human_string, score))
                recording = False

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--wav', type=str, default='', help='Audio file to be identified.')
    parser.add_argument(
        '--graph', type=str, default='', help='Model to use for identification.')
    parser.add_argument(
        '--labels', type=str, default='', help='Path to file containing labels.')
    parser.add_argument(
        '--input_name',
        type=str,
        default='wav_data:0',
        help='Name of WAVE data input node in model.')
    parser.add_argument(
        '--output_name',
        type=str,
        default='labels_softmax:0',
        help='Name of node outputting a prediction in the model.')
    parser.add_argument(
        '--how_many_labels',
        type=int,
        default=1,
        help='Number of results to show.')

    FLAGS, unparsed = parser.parse_known_args()
    tf.compat.v1.app.run(main=main, argv=[sys.argv[0]] + unparsed)
