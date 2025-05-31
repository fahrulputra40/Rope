<?php

namespace Fahrul\Rope;

use App\Controllers\BaseController;
use Fahrul\Rope\Type\FingerPrint;
use Fahrul\Rope\Type\Memo;
use Fahrul\Rope\Type\Update;

class RopeController extends BaseController
{

    public function index()
    {
        if (!$this->request->is('json')) {
            return $this->response->setStatusCode(403)->setJSON([
                'message' => "Unknown Request",
                'code'      => 0
            ]);
        }

        /** @var FingerPrint $fingerPrint*/
        $fingerPrint = $this->request->getJsonVar("fingerprint");
        /** @var Memo $serverMemo*/
        $serverMemo = $this->request->getJsonVar("memo");
        /** @var Update $update*/
        $update = $this->request->getJsonVar("update");

        try {
            $service = new RopeService();
            $service->addClass($fingerPrint->name, $fingerPrint->id, $fingerPrint->data, true);
            foreach ($serverMemo->children as $child) {
                $service->addClass($child->name, $child->id, $child->data, false);
            }
            $service->callUpdate($update->name);
            [$newData, $html, $id] = $service->getEffect();
            return  $this->response->setStatusCode(200)->setJSON([
                'effect' => [
                    "html" => $html,
                    "id" => $id
                ],
                'memo' => [
                    'data' => $newData
                ]
            ]);
        } catch (\Throwable $th) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => "Unknow error",
                'code'      => 1
            ]);
        }
    }
}
