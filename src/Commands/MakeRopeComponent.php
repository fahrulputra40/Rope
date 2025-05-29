<?php

namespace Fahrul\Rope\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use CodeIgniter\CLI\GeneratorTrait;
use Config\Generators;
use Throwable;

class MakeRopeComponent extends BaseCommand{
    use GeneratorTrait;

    private $viewName = '';

    protected $group       = 'Generators';
    protected $name        = 'make:rope';
    protected $description = 'Generate a new view cell class';

    public function run(array $params)
    {
        $this->component = 'Cell';
        $this->directory = 'Cells';

        $params = array_merge($params, ['suffix' => null]);

        $this->templatePath  = '/../../vendor/fahrul/rope/src/templates/RopeComponent.tpl.php';

        $className = $this->qualifyClassName();
        $this->viewName  = decamelize(class_basename($className));
        $this->viewName  = preg_replace(
            '/([a-z][a-z0-9_\/\\\\]+)(_cell)$/i',
            '$1',
            $this->viewName,
        ) ?? $this->viewName;
        
        $this->generateClass($params);

        $this->templatePath  = '/../../vendor/fahrul/rope/src/templates/RopeComponentView.tpl.php';
        $this->generateView($this->viewName, $params);
    }

    protected function renderTemplate(array $data = []): string
    {
        try {
            return view($this->templatePath, $data, ['debug' => false]);
        } catch (Throwable $e) {
            log_message('error', (string) $e);
            throw $e;
        }
    }

    protected function generateView(string $view, array $params): void
    {
        $this->params = $params;
        $namespace = $this->getNamespace();

        $base = APPPATH.'Views/rope';

        $file = $base . DIRECTORY_SEPARATOR
            . str_replace(
                '\\',
                DIRECTORY_SEPARATOR,
                trim(str_replace($namespace . '\\', '', $view), '\\'),
            ) . '.php';

        $target = implode(
            DIRECTORY_SEPARATOR,
            array_slice(
                explode(DIRECTORY_SEPARATOR, $file),
                0,
                -1,
            ),
        ) . DIRECTORY_SEPARATOR . $this->basename($file);

        $this->generateFile($target, $this->buildContent($view));
    }

    protected function parseTemplate(
        string $class,
        array $search = [],
        array $replace = [],
        array $data = [],
    ): string {
        // Retrieves the namespace part from the fully qualified class name.
        $namespace = trim(
            implode(
                '\\',
                array_slice(explode('\\', $class), 0, -1),
            ),
            '\\',
        );
        $search[]  = '<@php';
        $search[]  = '{namespace}';
        $search[]  = '{class}';
        $search[]  = '{view_name}';
        $replace[] = '<?php';
        $replace[] = $namespace;
        $replace[] = str_replace($namespace . '\\', '', $class);
        $replace[] = $this->viewName;
        

        return str_replace($search, $replace, $this->renderTemplate($data));
    }
}