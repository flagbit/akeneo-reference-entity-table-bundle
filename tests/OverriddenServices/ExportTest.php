<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Tests;

use Flagbit\Bundle\ReferenceEntityTableBundle\Connector\ArrayConverter\StandardToFlat\Record;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ExportTest extends KernelTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
    }

    public function testCustomRecordOverridesAkeneoRecord(): void
    {
        $recordConverter = self::$container->get('akeneo_referenceentity.job.array_converter.standard_to_flat.reference_entity_record');

        self::assertInstanceOf(Record::class, $recordConverter);
    }
}
