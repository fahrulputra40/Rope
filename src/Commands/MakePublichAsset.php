<?php

namespace Fahrul\Rope\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\Publisher\Publisher;
use Throwable;

class MakePublichAsset extends BaseCommand
{
    protected $group       = 'Rope';
    protected $name        = 'rope:publish';
    protected $description = 'Publish Rope assets into public folder';

    public function run(array $params)
    {
        $vendorPublisher = new Publisher(ROOTPATH . 'vendor/fahrul/rope/js/dist/js/', ROOTPATH."public");
        try {
            $vendorPublisher->publish();
        } catch (\Throwable $th) {
            $this->showError($th);
        }
    }
}