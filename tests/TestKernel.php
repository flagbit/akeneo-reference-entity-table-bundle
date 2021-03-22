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
            'akeneo_referenceentity.infrastructure.persistence.record.transformer.connector_value_registry',
            'akeneo_referenceentity.infrastructure.connector.api.record_value_validator_registry',
            'akeneo_referenceentity.infrastructure.persistence.record.hydrator.data_hydrator_registry',
            'akeneo_referenceentity.application.registry.edit_record.record_value_updater.record_value_updater_registry',
            'akeneo_referenceentity.application.registry.record.edit_record_value_command_factory_registry',
            'akeneo_referenceentity.application.registry.create_attribute_command_factory_registry',
            'akeneo_referenceentity.application.registry.edit_attribute_command_factory_registry',
            'akeneo_referenceentity.application.edit_attribute.attribute_updater.attribute_updater_registry',
            'akeneo_referenceentity.application.registry.attribute_factory',
            'akeneo_referenceentity.infrastructure.persistence.attribute.hydrator.attribute_hydrator_registry',
            'akeneo_referenceentity.infrastructure.connector.api.create.attribute_creation_validator',
            'akeneo_referenceentity.infrastructure.connector.api.edit.attribute_edition_validator',
            'akeneo_referenceentity.job.array_converter.standard_to_flat.reference_entity_record',
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
