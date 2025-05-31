<?php

namespace Fahrul\Rope\Trait;

trait WithEmit{
    /** @var mixed<string,string> $listener */
    protected mixed $listener;

    public function emit(string $name, ...$args){
        
    }
}