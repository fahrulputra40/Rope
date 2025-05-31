<?php 

namespace Fahrul\Rope;

use CodeIgniter\Cache\CacheInterface;
use CodeIgniter\View\Cell;
use CodeIgniter\View\Exceptions\ViewException;
use DOMDocument;
use DOMElement;
use CodeIgniter\View\Cells\Cell as BaseCell;

class RopeCell extends Cell{

    private DOMDocument $dom;
    static private $DATA_ATTR_KEY = "rope:data";

    public function __construct(CacheInterface $cache)
    {
        parent::__construct($cache);
        $this->dom = new DOMDocument();
    }

    
    public function renderPartial(BaseCell $cell){
        $params = $this->prepareParams(null);
        [$output, $state] = $this->renderBaseCell($cell, 'render', $params);
        return $output;
    }

    public function render(string $library, $params = null, int $ttl = 0, ?string $cacheName = null): string{
        [$template, $params, $state] =  $this->renderTemplate($library, $params, $ttl, $cacheName);
        $this->dom->loadHTML("<body>".$template.'</body>');
        $children = $this->dom->getElementsByTagName('body')[0]->childNodes;
        $count = 0;
        foreach($children as $child){
            if($child instanceof DOMElement) $count++;
        }
        if($count > 1 || $count == 0){
            return "<p>Invalid root component</p>";
        }else{
            $root = $children[0];
            $root->setAttribute('rope-id', isset($params['id']) ? $params['id'] : uniqid());
            $root->setAttribute('rope-name', $library);
            if($root->hasAttribute(self::$DATA_ATTR_KEY)){
                $data = $root->getAttribute(self::$DATA_ATTR_KEY);
                $root->removeAttribute(self::$DATA_ATTR_KEY);
                $data = json_decode($data, true);
                if($data != null) $state = array_merge($state, $data);
            }
            $root->setAttribute('rope-snapshot', json_encode($state));
            return $this->dom->saveHTML($root);
        }
    }

    private function renderTemplate(string $library, $params = null, int $ttl = 0, ?string $cacheName = null)
    {
        [$instance, $method] = $this->determineClass($library);

        $class = is_object($instance)
            ? $instance::class
            : null;

        $params = $this->prepareParams($params);

        if (method_exists($instance, 'initController')) {
            $instance->initController(service('request'), service('response'), service('logger'));
        }

        if (! method_exists($instance, $method)) {
            throw ViewException::forInvalidCellMethod($class, $method);
        }

        [$output, $state] = $this->renderBaseCell($instance, $method, $params);

        return [$output, $params, $state];
    }

    private function renderBaseCell(BaseCell $instance, string $method, array $params)
    {
        $publicProperties  = $instance->getPublicProperties();
        $privateProperties = array_column($instance->getNonPublicProperties(), 'name');
        $publicParams      = array_intersect_key($params, $publicProperties);

        foreach ($params as $key => $value) {
            $getter = 'get' . ucfirst((string) $key) . 'Property';
            if (in_array($key, $privateProperties, true) && method_exists($instance, $getter)) {
                $publicParams[$key] = $value;
            }
        }
        $instance = $instance->fill($publicParams);
        return [$instance->{$method}(), $publicProperties];
    }
}