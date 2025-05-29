<?php 

namespace Fahrul\Rope\Service;

use Fahrul\Rope\RopeCell;
use CodeIgniter\Config\BaseService;
use CodeIgniter\Config\Services as AppServices;

class Services extends BaseService
{
    public static function viewcell(bool $getShared = true)
    {
        echo "A";
        die;
        if ($getShared) {
            return static::getSharedInstance('viewcell');
        }

        return new RopeCell(AppServices::get('cache'));
    }
}