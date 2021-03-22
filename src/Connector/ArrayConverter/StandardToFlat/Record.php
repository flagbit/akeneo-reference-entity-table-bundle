<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Connector\ArrayConverter\StandardToFlat;

use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeIdentifier;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\ImageAttribute;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\NumberAttribute;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\OptionAttribute;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\OptionCollectionAttribute;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\RecordAttribute;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\RecordCollectionAttribute;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\TextAttribute;
use Akeneo\ReferenceEntity\Domain\Repository\AttributeRepositoryInterface;
use Akeneo\Tool\Component\Connector\ArrayConverter\StandardToFlat\AbstractSimpleArrayConverter;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;

class Record extends AbstractSimpleArrayConverter
{
    private AttributeRepositoryInterface $attributeRepository;

    /**
     * @var AbstractAttribute[]
     */
    private array $cachedAttributes = [];

    public function __construct(AttributeRepositoryInterface $attributeRepository)
    {
        $this->attributeRepository = $attributeRepository;
    }

    /**
     * @param string       $property
     * @param mixed        $data
     * @param array<mixed> $convertedItem
     * @param array<mixed> $options
     * @return array<mixed>
     */
    protected function convertProperty($property, $data, array $convertedItem, array $options)
    {
        switch ($property) {
            case 'code':
            case 'referenceEntityIdentifier':
                $convertedItem[$property] = $data;
                break;
            case 'values':
                $convertedItem = $this->convertValues($convertedItem, $data);
                break;
            case 'identifier': // we don't expose the identifier
            default:
                break;
        }

        return $convertedItem;
    }

    /**
     * @param array<string, mixed> $convertedItem
     * @param array<string, mixed> $values
     * @return array<string, mixed>
     */
    protected function convertValues(array $convertedItem, array $values): array
    {
        foreach ($values as $value) {
            $attribute = $this->getAttribute($value['attribute']);
            $key = $this->generateKey($attribute, $value);
            $data = null;

            switch ($attribute->getType()) {
                case NumberAttribute::ATTRIBUTE_TYPE:
                case TextAttribute::ATTRIBUTE_TYPE:
                case OptionAttribute::ATTRIBUTE_TYPE:
                case RecordAttribute::ATTRIBUTE_TYPE:
                    $data = $value['data'];
                    break;
                case OptionCollectionAttribute::ATTRIBUTE_TYPE:
                case RecordCollectionAttribute::ATTRIBUTE_TYPE:
                    $data = implode(',', $value['data']);
                    break;
                case ImageAttribute::ATTRIBUTE_TYPE:
                    $data = $value['data']['filePath'];
                    break;
                case TableAttribute::ATTRIBUTE_TYPE_NAME:
                    $data = json_encode($value['data']);
                    break;
                default:
                    break;
            }
            $convertedItem[$key] = $data;
        }

        return $convertedItem;
    }

    private function getAttribute(string $attributeIdentifier): AbstractAttribute
    {
        if (!isset($this->cachedAttributes[$attributeIdentifier])) {
            $this->cachedAttributes[$attributeIdentifier] = $this->attributeRepository->getByIdentifier(
                AttributeIdentifier::fromString($attributeIdentifier)
            );
        }

        return $this->cachedAttributes[$attributeIdentifier];
    }

    /**
     * @param array<string, mixed> $value
     */
    private function generateKey(AbstractAttribute $attribute, array $value): string
    {
        $key = $attribute->getCode()->__toString();
        if ($attribute->hasValuePerLocale()) {
            $key = sprintf('%s-%s', $key, $value['locale']);
        }
        if ($attribute->hasValuePerChannel()) {
            $key = sprintf('%s-%s', $key, $value['channel']);
        }

        return $key;
    }
}
