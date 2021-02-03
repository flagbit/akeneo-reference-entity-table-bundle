<?php


namespace Flagbit\Bundle\ReferenceEntityTableBundle\Tests;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class RemoveServiceCompilerPass implements CompilerPassInterface
{
    /**
     * @var string[]
     */
    private $serviceIds;

    public function __construct(array $serviceIds)
    {
        $this->serviceIds = $serviceIds;
    }

    public function process(ContainerBuilder $container)
    {
        foreach ($this->serviceIds as $serviceId) {
            $container->removeDefinition($serviceId);
        }
    }
}
