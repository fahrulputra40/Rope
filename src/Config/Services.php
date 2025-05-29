<?php 

namespace Fahrul\Rope\Config;

use Fahrul\Rope\RopeCell;
use CodeIgniter\Config\BaseService;
use CodeIgniter\Config\Services as AppServices;

class Services extends BaseService
{
    public static function viewcell(bool $getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('viewcell');
        }

        return new RopeCell(AppServices::get('cache'));
    }
}