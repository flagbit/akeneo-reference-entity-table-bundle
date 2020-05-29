<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command;

use Akeneo\ReferenceEntity\Application\Record\EditRecord\CommandFactory\AbstractEditValueCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;

class EditTableValueCommand extends AbstractEditValueCommand
{
    /** @var string */
    public $tableValue;

    public function __construct(TableAttribute $attribute, ?string $channel, ?string $locale, string $newTableValue)
    {
        parent::__construct($attribute, $channel, $locale);

        $this->tableValue = $newTableValue;
    }
}
