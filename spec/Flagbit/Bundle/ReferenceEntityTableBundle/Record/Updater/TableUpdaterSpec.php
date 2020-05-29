<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Record\Updater;

use Akeneo\ReferenceEntity\Application\Record\EditRecord\CommandFactory\AbstractEditValueCommand;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeIdentifier;
use Akeneo\ReferenceEntity\Domain\Model\ChannelIdentifier;
use Akeneo\ReferenceEntity\Domain\Model\LocaleIdentifier;
use Akeneo\ReferenceEntity\Domain\Model\Record\Record;
use Akeneo\ReferenceEntity\Domain\Model\Record\Value\ChannelReference;
use Akeneo\ReferenceEntity\Domain\Model\Record\Value\LocaleReference;
use Akeneo\ReferenceEntity\Domain\Model\Record\Value\Value;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command\EditTableValueCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\TableData;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\Updater\TableUpdater;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use RuntimeException;

class TableUpdaterSpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableUpdater::class);
    }

    public function it_does_support_edit_command(EditTableValueCommand $command): void
    {
        $this->supports($command)->shouldReturn(true);
    }

    public function it_does_not_support_edit_command(AbstractEditValueCommand $command): void
    {
        $this->supports($command)->shouldReturn(false);
    }

    public function it_does_not_update_with_invalid_command(Record $record, AbstractEditValueCommand $command): void
    {
        $this->shouldThrow(RuntimeException::class)->during('__invoke', [$record, $command]);
    }

    public function it_does_update_record(
        Record $record,
        EditTableValueCommand $command,
        AttributeIdentifier $attributeIdentifier,
        TableAttribute $attribute
    ): void {
        $attribute->getIdentifier()->willReturn($attributeIdentifier);
        $command->attribute = $attribute;
        $command->channel = 'channel';
        $command->locale = 'locale';
        $command->tableValue = '{}';

        $channelReference = ChannelReference::fromChannelIdentifier(ChannelIdentifier::fromCode('channel'));
        $localeReference = LocaleReference::fromLocaleIdentifier(LocaleIdentifier::fromCode('locale'));
        $tableValue = TableData::createFromNormalize('{}');

        $value = Value::create($attributeIdentifier->getWrappedObject(), $channelReference, $localeReference, $tableValue);

        $record->setValue(Argument::exact($value))->shouldBeCalledOnce();

        $this->__invoke($record, $command);
    }

    public function it_does_update_record_with_nullables(
        Record $record,
        EditTableValueCommand $command,
        AttributeIdentifier $attributeIdentifier,
        TableAttribute $attribute
    ): void {
        $attribute->getIdentifier()->willReturn($attributeIdentifier);
        $command->attribute = $attribute;
        $command->channel = null;
        $command->locale = null;
        $command->tableValue = '{}';

        $channelReference = ChannelReference::noReference();
        $localeReference = LocaleReference::noReference();
        $tableValue = TableData::createFromNormalize('{}');

        $value = Value::create($attributeIdentifier->getWrappedObject(), $channelReference, $localeReference, $tableValue);

        $record->setValue(Argument::exact($value))->shouldBeCalledOnce();

        $this->__invoke($record, $command);
    }
}
