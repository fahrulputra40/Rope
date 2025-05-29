<?php

namespace Fahrul\Rope;

use CodeIgniter\View\Cells\Cell;

class RopeBaseCell extends Cell{
    final public $id;
    final public $className;

    function __construct()
    {
        $this->className = class_basename(static::class);
        $this->id = substr(md5($this->className), 0, 8);
    }
}