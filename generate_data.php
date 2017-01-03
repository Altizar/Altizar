<?php

$headers = array();
$headers[] = ("Expires: 0");
$headers[] = ("Cache-Control: must-revalidate, post-check=0, pre-check=0");
$headers[] = ("Content-Type: application/force-download");
$headers[] = ("Content-Type: application/octet-stream");
$headers[] = ("Content-Type: application/download");
$headers[] = ('Content-Disposition: attachment;filename="MQO_Expo_Base.js"');
$headers[] = ("Content-Transfer-Encoding: binary ");

foreach ($headers as $header) {
    header($header);
}

$theDump = array();
$expoRates = array();
for ($lvl = 0; $lvl <= 40; $lvl++) {
    $expoRates[$lvl]['base'] = 1 - exp(-$lvl / 31);
    $expoRates[$lvl]['gem'] = $expoRates[$lvl]['base'] * 0.5;
    $expoRates[$lvl]['relic'] = $expoRates[$lvl]['base'] * 10;
    $expoRates[$lvl]['key'] = $expoRates[$lvl]['base'] * 0.25;
    $expoRates[$lvl]['orb'] = $expoRates[$lvl]['base'] * 0.5;
    $expoRates[$lvl]['scroll'] = $expoRates[$lvl]['base'] * 0.5;
    $expoRates[$lvl]['time'] = $expoRates[$lvl]['base'] * 4;
    $expoRates[$lvl]['basecost'] = ceil(100000 * pow(1.25, $lvl - 1));
    if ($lvl === 0) {
        $expoRates[$lvl]['basecost'] = 0;
    }
    $curCost = 0;
    $prevCost = 0;
    if (!empty($expoRates[$lvl]['BaseCost'])) {
        $curCost = $expoRates[$lvl]['BaseCost'];
    }
    if (!empty($expoRates[$lvl - 1]['BaseCost'])) {
        $prevCost = $expoRates[$lvl - 1]['BaseCost'];
    }
    $expoRates[$lvl]['totalcost'] = ceil($curCost + $prevCost);
}
$tierCost = array(1 => 1, 2 => 0.752, 3 => 0.5, 4 => 0.25, 5 => 0.1);
$resourceCosts = array();
for ($lvl = 0; $lvl <= 40; $lvl++) {
    for ($tier = 1; $tier <= 5; $tier++) {
        $resourceCosts[$tier][$lvl]['BaseCost'] = ceil(5000 * pow(1.2, $lvl - 1) * $tierCost[$tier]);
        $resourceCosts[$tier][$lvl]['TotalCost'] = ceil($tierCost[$tier] * 5000 * (1 - pow(1.2, $lvl)) / (-0.2));
        if ($lvl === 0) {
            $resourceCosts[$tier][$lvl]['BaseCost'] = 0;
            $resourceCosts[$tier][$lvl]['TotalCost'] = 0;
        }
    }
}

$expoCost = array();
$baseExpo = array();
$maxLevel = 30;
$minLevel = 0;
for ($warrior = $minLevel; $warrior <= $maxLevel; $warrior++) {
    for ($hunter = $minLevel; $hunter <= $maxLevel; $hunter++) {
        for ($mage = $minLevel; $mage <= $maxLevel; $mage++) {
            for ($healer = $minLevel; $healer <= $maxLevel; $healer++) {
                if (( ($warrior + $hunter + $mage + $healer) <= 3) ||
                        (max(array($warrior, $hunter, $mage, $healer)) * 3 < ($warrior + $hunter + $mage + $healer) ) ||
                        ($warrior == 0 && (min(array($hunter, $mage, $healer)) == max(array($hunter, $mage, $healer)) - 1) && ((max(array($warrior, $hunter, $mage, $healer)) - 1) * 3 < ($warrior + $hunter + $mage + $healer) )) ||
                        ($hunter == 0 && (min(array($warrior, $mage, $healer)) == max(array($warrior, $mage, $healer)) - 1) && ((max(array($warrior, $hunter, $mage, $healer)) - 1) * 3 < ($warrior + $hunter + $mage + $healer) )) ||
                        ($mage == 0 && (min(array($hunter, $warrior, $healer)) == max(array($hunter, $warrior, $healer)) - 1) && ((max(array($warrior, $hunter, $mage, $healer)) - 1) * 3 < ($warrior + $hunter + $mage + $healer) )) ||
                        ($healer == 0 && (min(array($hunter, $mage, $warrior)) == max(array($hunter, $mage, $warrior)) - 1) && ((max(array($warrior, $hunter, $mage, $healer)) - 1) * 3 < ($warrior + $hunter + $mage + $healer) ))) {
                    $lvl = $warrior + $hunter + $mage + $healer;
                    $name = $lvl . '_' . ($warrior + $mage);
                    foreach ($expoRates as $expoLevel => $expoValue) {
                        $expoCost['gem'][$lvl . '_' . ($warrior + $mage)][$expoLevel] = round($lvl / 7 + round(($warrior + $mage) * $expoValue['gem']));
                        $expoCost['relic'][$lvl . '_' . ($warrior + $hunter)][$expoLevel] = ceil($lvl + round(($warrior + $hunter) * $expoValue['relic'])) + 2;
                        $expoCost['key'][$lvl . '_' . ($hunter + $healer)][$expoLevel] = floor($lvl / 18 + floor(($hunter + $healer) * $expoValue['key']));
                        $expoCost['orb'][$lvl . '_' . ($mage + $healer)][$expoLevel] = round($lvl / 20 + round(($mage + $healer) * $expoValue['orb']));
                        $expoCost['scroll'][$lvl . '_' . ($hunter + $mage)][$expoLevel] = round($lvl / 20 + round(($hunter + $mage) * $expoValue['scroll']));
                        $expoCost['time'][$lvl . '_' . ($warrior + $healer)][$expoLevel] = round(6 * $lvl + 40 - round(($warrior + $healer) * $expoValue['time']));
                    }
                    $baseName = $warrior . '/' . $hunter . '/' . $mage . '/' . $healer;
                    $baseExpo[$baseName] = array(
                        'level' => $lvl,
                        'name' => $baseName,
                        'gem_key' => $lvl . '_' . ($warrior + $mage),
                        'relic_key' => $lvl . '_' . ($warrior + $hunter),
                        'key_key' => $lvl . '_' . ($hunter + $healer),
                        'orb_key' => $lvl . '_' . ($mage + $healer),
                        'scroll_key' => $lvl . '_' . ($hunter + $mage),
                        'time_key' => $lvl . '_' . ($warrior + $healer),
                    );
                }
            }
        }
    }
}

//print_r($baseExpo['12/7/12/8']);
//echo "\n";
//print_r($expoCost['gem']['39_24'][21]);
//echo "\n";
//print_r($expoCost['relic']['39_19'][21]);
//echo "\n";
//print_r($expoCost['key']['39_15'][21]);
//echo "\n";
//print_r($expoCost['orb']['39_20'][21]);
//echo "\n";
//print_r($expoCost['scroll']['39_19'][21]);
//echo "\n";
//print_r($expoCost['time']['39_20'][21]);
//echo "\n\n";
//exit;
echo 'var expoCost = ' . json_encode($expoCost);
echo "\n\n";
echo 'var expoRates = ' . json_encode($expoRates);
echo "\n\n";
echo 'var expoBase = ' . json_encode($baseExpo);
echo "\n\n";
echo 'var resourceCosts = ' . json_encode($resourceCosts);

exit;
