<?php

namespace Fahrul\Rope;

use App\Controllers\BaseController;

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

        // $fingerPrint = $this->request->getPost("fingerprint");
        // $serverMemo = $this->request->getPost("serverMemo");
        // $updates = $this->request->getPost("updates");

        return  $this->response->setStatusCode(200)->setJSON([
            'effect' => [
                [
                    'dirty' => 'xsahh',
                    "html" => '<div>...</div>'
                ]
            ],
            'memo' => [
                'checksum' => '123'
            ]
        ]);
    }
}
