<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Tests;

use Symfony\Component\DependencyInjection\Compiler\PassConfig;
use Symfony\Component\DependencyInjection\ContainerBuilder;

require_once __DIR__ . '/../vendor/akeneo/pim-enterprise-dev/src/Kernel.php';

class TestKernel extends \Kernel
{
    public function registerBundles(): iterable
    {
        $bundles = require $this->getProjectDir() . '/vendor/akeneo/pim-enterprise-dev/config/bundles.php';
        $bundles += require $this->getProjectDir() . '/config/bundles.php';

        foreach ($bundles as $class => $envs) {
            if ($envs[$this->environment] ?? $envs['all'] ?? false) {
                yield new $class();
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getCacheDir(): string
    {
        return $this->getProjectDir() . '/tests/var/cache/' . $this->environment;
    }

    /**
     * {@inheritdoc}
     */
    public function getLogDir(): string
    {
        return $this->getProjectDir() . '/tests/var/logs';
    }

    /**
     * {@inheritdoc}
     */
    public function getProjectDir(): string
    {
        return \dirname(__DIR__);
    }

    protected function build(ContainerBuilder $container)
    {
        $serviceIds = [
            'akeneo_referenceentity.infrastructure.persistence.repository.attribute',
            'akeneo.referencentity.infrastructure.persistence.query.get_attribute_identifier',
        ];
        $container->addCompilerPass(new PublicServiceCompilerPass($serviceIds));

        // current workaround: Class of this service doesn't autoload. Needs research why it is that way.
        $serviceIds = [
            'akeneo_integration_tests.fixture.loader.product_and_product_model_with_removed_attribute',
        ];
        $optimization = PassConfig::TYPE_BEFORE_OPTIMIZATION;
        $container->addCompilerPass(new RemoveServiceCompilerPass($serviceIds), $optimization, 1000);
    }
}
