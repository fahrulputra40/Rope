<?php

namespace Fahrul\Rope\Trait\State;

class ClassWrapper{
    public string $id;
    public $instance;
    public $prevState = [];

    public function __construct($id, $instance, $data = [])
    {
        $this->id = $id;
        $this->instance = $instance;
        $this->prevState = $data;
    }

    public function hasDiffState(){
        $dirty = [];
        foreach($this->prevState as $key => $value){
            if($this->instance->{$key} != $value) array_push($dirty, $key);
        }
        return count($dirty);
    }
}