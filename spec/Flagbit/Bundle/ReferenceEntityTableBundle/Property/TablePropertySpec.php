<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Property;

use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CreateTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\EditTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Property\TableProperty;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use Symfony\Component\Validator\Violation\ConstraintViolationBuilderInterface;

class TablePropertySpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableProperty::class);
    }

    public function it_normalizes_property(): void
    {
        $this->beConstructedThrough('fromArray', [['table_property']]);

        $this->normalize()->shouldReturn(['table_property']);
    }

    // Validation

    public function it_validates_property_of_create_command(
        ExecutionContextInterface $executionContext,
        CreateTableAttributeCommand $command
    ): void {
        $this->beConstructedThrough('fromArray', [[]]);

        $tableProperty = [
            ['code' => 'foo1', 'type' => 'text'],
            ['code' => 'foo2', 'type' => 'text'],
            ['code' => 'foo4', 'type' => 'text'],
            ['code' => 'foo3', 'type' => 'text'],
        ];
        $command->tableProperty = $tableProperty;

        $executionContext->buildViolation(Argument::any())->shouldBeCalledTimes(0);

        $this->validateProperty($command, $executionContext);
    }

    public function it_validates_property_of_edit_command(
        ExecutionContextInterface $executionContext,
        EditTableAttributeCommand $command
    ): void {
        $this->beConstructedThrough('fromArray', [[]]);

        $tableProperty = [
            ['code' => 'foo1', 'type' => 'text'],
            ['code' => 'foo2', 'type' => 'text'],
            ['code' => 'foo4', 'type' => 'text'],
            ['code' => 'foo3', 'type' => 'text'],
        ];
        $command->tableProperty = $tableProperty;

        $executionContext->buildViolation(Argument::any())->shouldBeCalledTimes(0);

        $this->validateProperty($command, $executionContext);
    }

    public function it_validates_property_of_invalid_command(
        ExecutionContextInterface $executionContext,
        ConstraintViolationBuilderInterface $builder1,
        ConstraintViolationBuilderInterface $builder2,
        CreateTableAttributeCommand $command
    ): void {
        $this->beConstructedThrough('fromArray', [[]]);

        $tableProperty = [
            ['code' => 'foo1', 'type' => 'text'],
            ['code' => 'foo2', 'type' => 'text'],
            ['code' => 'foo1', 'type' => 'text'],
            ['code' => 'foo3', 'type' => 'text'],
            ['code' => 'foo3', 'type' => 'text'],
        ];
        $command->tableProperty = $tableProperty;

        $builder1->atPath('tableProperty[2][code]')
            ->willReturn($builder1)
            ->shouldBeCalled();
        $builder2->atPath('tableProperty[4][code]')
            ->willReturn($builder2)
            ->shouldBeCalled();
        $builder1->addViolation()->shouldBeCalled();
        $builder2->addViolation()->shouldBeCalled();

        $executionContext->buildViolation('pim_reference_entity.attribute.validation.duplicate_code', ['{{code}}' => 'foo1'])
            ->willReturn($builder1)
            ->shouldBeCalled();
        $executionContext->buildViolation('pim_reference_entity.attribute.validation.duplicate_code', ['{{code}}' => 'foo3'])
            ->willReturn($builder2)
            ->shouldBeCalled();

        $this->validateProperty($command, $executionContext);
    }
}
