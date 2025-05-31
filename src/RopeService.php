<?php

namespace Fahrul\Rope;

use CodeIgniter\Config\Factories;
use Fahrul\Rope\Trait\State\ClassWrapper;

class RopeService
{
    public static string $NAMEPSACE = "App\\Cells\\";
    private array $childrenInstances = [];
    /** @var ClassWrapper $parentInstance */
    private $parentInstance = null;

    public function addClass(string $className, string $id, $data = [], bool $isParent = false)
    {
        $object = Factories::cells(self::$NAMEPSACE . $className, ['getShared' => false]);
        foreach ($data as $key => $value) {
            $object->{$key} = $value;
        }
        $wrapper = new ClassWrapper($id, $object, $data);
        if ($isParent) {
            $this->parentInstance = $wrapper;
        } else {
            array_push($this->childrenInstances, $wrapper);
        }
    }

    public function callUpdate(string $name)
    {
        if (method_exists($this->parentInstance->instance, $name))
            $this->parentInstance->instance->{$name}();
    }

    public function getEffect()
    {
        if ($this->parentInstance->hasDiffState() > 0) {
            $data = [];
            foreach ($this->parentInstance->prevState as $key => $item) {
                $data[$key] = $this->parentInstance->instance->{$key};
            }
            return [$data, service('viewcell')->renderPartial($this->parentInstance->instance), $this->parentInstance->id];
        } else {
            // if the emiter is enable it can see state changed in children
        }
        throw "There is no effect";
    }
}
