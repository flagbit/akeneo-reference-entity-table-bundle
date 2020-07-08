<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Tests;

use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command\CommandFactory\EditTableCommandFactory;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command\EditTableValueCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\JsonSchema\TableTypeValidator;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\TableConnectorValueTransformer;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\TableDataHydrator;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\Updater\TableUpdater;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class RecordTagsTest extends KernelTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
    }

    public function testSupportsCreateCommandFactory(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.application.registry.record.edit_record_value_command_factory_registry');

        $factory = $registry->getFactory($this->createMock(TableAttribute::class), ['data' => ['data']]);

        self::assertInstanceOf(EditTableCommandFactory::class, $factory);
    }

    public function testSupportsTableUpdater(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.application.registry.edit_record.record_value_updater.record_value_updater_registry');

        $updater = $registry->getUpdater($this->createMock(EditTableValueCommand::class));

        self::assertInstanceOf(TableUpdater::class, $updater);
    }

    public function testSupportsTableHydrator(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.infrastructure.persistence.record.hydrator.data_hydrator_registry');

        $hydrator = $registry->getHydrator($this->createMock(TableAttribute::class));

        self::assertInstanceOf(TableDataHydrator::class, $hydrator);
    }

    public function testSupportsTableTypeValidator(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.infrastructure.connector.api.record_value_validator_registry');

        $validator = $registry->getValidator(TableAttribute::class);

        self::assertInstanceOf(TableTypeValidator::class, $validator);
    }

    public function testSupportsTableConnectorValueTransformer(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.infrastructure.persistence.record.transformer.connector_value_registry');

        $transformer = $registry->getTransformer($this->createMock(TableAttribute::class));

        self::assertInstanceOf(TableConnectorValueTransformer::class, $transformer);
    }
}
