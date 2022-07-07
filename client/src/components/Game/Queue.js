export class Queue
{
  constructor()
  {
    this.h = null;
    this.t = null;
    this.length = 0;
  }
  push(c)
  {
    this.enqueue(c);
  }
  enqueue(c)
  {
    if (this.length > 0)
    {
      this.t.n = {v: c, p: this.t, n: null};
      this.t = this.t.n;
    }
    else
    {
      this.t = {v: c, p: null, n: null};
      this.h = this.t;
    }
    ++ this.length;
  }
  enqueueFront(c)
  {
    if (this.length > 0)
    {
      this.h = {v: c, p: null, n: this.h};
    }
    else
    {
      this.h = {v: c, p: null, n: null};
      this.t = this.h;
    }
    ++ this.length;
  }

  dequeue()
  {
    if (this.length > 0)
    {

      let v = this.h.v;

      this.h = this.h.n;
      if (this.h != null)
      {
	this.h.p = null;
      }
      else
      {
	this.t = null;
      }
      -- this.length;
      return v;
    }
    else
    {
      throw "Attempted to dequeue an empty queue.";
    }
  }
  pop()
  {
    if (this.length > 0)
    {
      let v = this.t.v;

      this.t = this.t.p;
      if (this.t != null)
      {
	this.t.n = null;
      }
      -- this.length;
      return v;
    }
    else
    {
      throw "Attempted to dequeue an empty queue.";
    }
  }
  
  contains(c)
  {
    if (this.c_x[c.x] == undefined || this.c_x[c.x][c.y] == undefined)
    {
      return false;
    }
    return true;
  }
  doesNotContain(c)
  {
    return this.contains(c) == false;
  }

  front()
  {
    if (this.h == null)
    {
      return undefined;
    }
    return this.h.v;
  }
  last()
  {
    if (this.t == null)
    {
      return undefined;
    }
    return this.t.v;
  }
  nonempty()
  {
    return this.length > 0;
  }
  empty()
  {
    return this.length <= 0;
  }
  size()
  {
    return this.length;
  }
  forEach( f )
  {
    let cur = this.h;
    while (cur != null)
    {
      f(cur.v);
      cur = cur.n;
    }
  }
  
  *[Symbol.iterator]()
  {
    let cur = this.h;
    while (cur != null)
    {
      yield cur.v;
      cur = cur.n;
    }
  }
  fromArray(a)
  {
    for (let i of a)
      this.enqueue(i);
  }
  toArray()
  {
    let cur = this.h;
    let ret = [];
    while (cur != null)
    {
      ret.push(cur.v);
      cur = cur.n;
    }
    return ret;
  }

  clear()
  {
    while (this.nonempty())
    {
      this.dequeue();
    }
  }
}

