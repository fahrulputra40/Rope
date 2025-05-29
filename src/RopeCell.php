<?php 

namespace Fahrul\Rope;

use CodeIgniter\View\Cell;

class RopeCell extends Cell{

    final public function render(string $library, $params = null, int $ttl = 0, ?string $cacheName = null): string{
        echo "ok";
        die;
        $template =  parent::render($library, $params, $ttl, $cacheName);
        return $template;
    }
}