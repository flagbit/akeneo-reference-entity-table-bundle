<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command;

use Akeneo\ReferenceEntity\Application\Record\EditRecord\CommandFactory\AbstractEditValueCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;

class EditTableValueCommand extends AbstractEditValueCommand
{
    /** @var array<mixed> */
    public $tableValue;

    /**
     * @param TableAttribute $attribute
     * @param string|null    $channel
     * @param string|null    $locale
     * @param array<mixed>   $newTableValue
     */
    public function __construct(TableAttribute $attribute, ?string $channel, ?string $locale, array $newTableValue)
    {
        parent::__construct($attribute, $channel, $locale);

        $this->tableValue = $newTableValue;
    }
}
