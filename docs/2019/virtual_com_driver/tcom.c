#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/module.h>
/* para os codigos de erros que serão utilizados daqui para a frente */
#include <linux/errno.h> 
/* controlar o sistema de arquivos */
#include <linux/fs.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
/* alocar memoria no kernel space */
#include <linux/slab.h> 
/* medir o tamanho das variaveis usado no kmalloc */
#include <linux/types.h> 
#include <linux/fcntl.h> /* O_ACCMODE */
int memory_major = 60;
/* Buffer para guardar os dados */
char *memory_buffer;
static void finish_com(void)
{
    /* liberando o numero de versao */
  unregister_chrdev(memory_major, "memory");
  /* liberando a memoria para outro programa */
  if (memory_buffer) {
    kfree(memory_buffer);
  }
  printk("<1>Removing memory module\n");
}



int memory_open(struct inode *inode, struct file *filp) {
  /* Success */
  return 0;
}
int memory_release(struct inode *inode, struct file *filp) {
  /* Success */
  return 0;
}
static ssize_t memory_read(struct file *filp, char *buf, 

                    size_t count, loff_t *f_pos) { 
  /* Copia para o user space */ 
  raw_copy_to_user(buf,memory_buffer,1);
  /* Changing reading position as best suits */ 
  if (*f_pos == 0) { 
    *f_pos+=1; 
    return 1; 
  } else { 
    return 0; 
  }
}

static ssize_t memory_write( struct file *filp, const char *buf,
                      size_t count, loff_t *f_pos) {
  char *tmp;
  tmp=buf+count-1;
  raw_copy_from_user(memory_buffer,tmp,1);
  return 1;
}


static struct file_operations tcom_fops = 
{
    .owner   = THIS_MODULE,
    .read    = memory_read,
    .write   = memory_write,
    .open    = memory_open,
    .release = memory_release
};


static int init_com(void)
{
    int result;
  /* registrando o driver */
 register_chrdev(memory_major, "memory", &tcom_fops); //TODO FIX NULL with pointer to file_operands
  /* alocar a memoria para o driver */
  memory_buffer = kmalloc(1, GFP_KERNEL); 
  if (!memory_buffer) { 
    result = -ENOMEM;
    finish_com();
    return result;
  } 
  memset(memory_buffer, 0, 1);
  return 0;
}
MODULE_LICENSE("Dual BSD/GPL");
module_init(init_com);
module_exit(finish_com);

