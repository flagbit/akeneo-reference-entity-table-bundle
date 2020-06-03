<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Tests;

use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeCode;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeIdentifier;
use Akeneo\ReferenceEntity\Domain\Model\ReferenceEntity\ReferenceEntityIdentifier;
use Akeneo\ReferenceEntity\Domain\Query\Attribute\GetAttributeIdentifierInterface;
use Akeneo\ReferenceEntity\Domain\Repository\AttributeRepositoryInterface;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CommandFactory\CreateTableAttributeCommandFactory;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CommandFactory\EditTableAttributeCommandFactory;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CreateTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\EditTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttributeFactory;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttributeHydrator;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Updater\TableAttributeUpdater;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class AttributeTagsTest extends KernelTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
    }

    public function testSupportsCreateCommandFactory(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.application.registry.create_attribute_command_factory_registry');

        $factory = $registry->getFactory(['type' => TableAttribute::ATTRIBUTE_TYPE_NAME]);

        self::assertInstanceOf(CreateTableAttributeCommandFactory::class, $factory);
    }

    public function testSupportsEditCommandFactory(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.application.registry.edit_attribute_command_factory_registry');

        $factories = $registry->getFactories(['table_property' => 'table_property', 'identifier' => 'identifier']);

        self::assertCount(1, $factories);
        self::assertContainsOnlyInstancesOf(EditTableAttributeCommandFactory::class, $factories);
    }

    public function testSupportsTableUpdater(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.application.edit_attribute.attribute_updater.attribute_updater_registry');

        $updater = $registry->getUpdater($this->createMock(TableAttribute::class), $this->createMock(EditTableAttributeCommand::class));

        self::assertInstanceOf(TableAttributeUpdater::class, $updater);
    }

    public function testSupportsTableAttributeFactory(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.application.registry.attribute_factory');

        $factory = $registry->getFactory($this->createMock(CreateTableAttributeCommand::class));

        self::assertInstanceOf(TableAttributeFactory::class, $factory);
    }

    public function testSupportsTableAttributeHydrator(): void
    {
        $registry = self::$container->get('akeneo_referenceentity.infrastructure.persistence.attribute.hydrator.attribute_hydrator_registry');

        $hydrator = $registry->getHydrator(['attribute_type' => TableAttribute::ATTRIBUTE_TYPE_NAME]);

        self::assertInstanceOf(TableAttributeHydrator::class, $hydrator);
    }

    public function testSupportsAttributeCreationValidator(): void
    {
        $normalizedAttribute = [
            'code' => 'code',
            'type' => 'flagbit_table',
            'value_per_locale' => false,
            'value_per_channel' => false,
        ];

        $registry = self::$container->get('akeneo_referenceentity.infrastructure.connector.api.create.attribute_creation_validator');

        self::assertCount(0, $registry->validate($normalizedAttribute));
    }

    public function testSupportsAttributeEditValidator(): void
    {
        $normalizedAttribute = [
            'code' => 'code',
            'type' => 'flagbit_table',
            'value_per_locale' => false,
            'value_per_channel' => false,
            'is_required_for_completeness' => false,
            'labels' => ['de_DE' => 'fuu', 'en_US' => 'foo'],
            '_links' => ['link' => ''],
        ];
        $referenceEntityId = ReferenceEntityIdentifier::fromString('ref');
        $attributeCode = AttributeCode::fromString('code');

        $this->mockAttributeEditionValidatorDependencyServices();

        $registry = self::$container->get('akeneo_referenceentity.infrastructure.connector.api.edit.attribute_edition_validator');

        self::assertCount(0, $registry->validate($referenceEntityId, $attributeCode, $normalizedAttribute));
    }

    private function mockAttributeEditionValidatorDependencyServices()
    {
        $attributeIdentifier = $this->createMock(AttributeIdentifier::class);

        $repository = $this->createMock(AttributeRepositoryInterface::class);
        $repository->method('getByIdentifier')
            ->with($attributeIdentifier)
            ->willReturn($this->createMock(TableAttribute::class));
        self::$container->set('akeneo_referenceentity.infrastructure.persistence.repository.attribute', $repository);

        $repository = $this->createMock(GetAttributeIdentifierInterface::class);
        $repository->method('withReferenceEntityAndCode')
            ->willReturn($attributeIdentifier);
        self::$container->set('akeneo.referencentity.infrastructure.persistence.query.get_attribute_identifier', $repository);
    }
}
