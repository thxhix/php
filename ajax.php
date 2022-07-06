<?
require_once($_SERVER['DOCUMENT_ROOT'] . "/bitrix/modules/main/include/prolog_before.php");

use Bitrix\Main\Loader;

use Bitrix\Highloadblock as HL;
use Bitrix\Main\Entity;

function getIdFromArr($arr, $field)
{
   $res = [];
   foreach ($arr as $key => $item) {
      $res[] = $item["$field"];
   }
   return $res;
}

$allProperty = [];

$property_enums = CIBlockPropertyEnum::GetList(array("ID" => "ASC", "SORT" => "ASC"), array("IBLOCK_ID" => 9));
while ($enum_fields = $property_enums->GetNext()) {
   $allProperty[] = $enum_fields;
}

$prop_check_id = [];

foreach ($allProperty as $key => $item) {
   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'TEMP_REG') {
      $prop_check_id['TEMP_ID'] = $item['ID'];
   }

   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'CHECK_PROCENT') {
      $prop_check_id['PROCENT_ID'] = $item['ID'];
   }

   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'HAS_AUTO') {
      $prop_check_id['HAS_AUTO_ID'] = $item['ID'];
   }

   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'ONLY_LETTER') {
      $prop_check_id['ONLY_LETTER_ID'] = $item['ID'];
   }

   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'NOTIFICATION_MANAGER') {
      $prop_check_id['NOTIFICATION_MANAGER_ID'] = $item['ID'];
   }

   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'AUTO_ANSWER') {
      $prop_check_id['AUTO_ANSWER_ID'] = $item['ID'];
   }
   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'DRAFT') {
      $prop_check_id['DRAFT'] = $item['ID'];
   }

   if ($item['PROPERTY_CODE'] == 'DRAFT') {
      $prop_check_id['DRAFT'] = $item['ID'];
   }

   if ($item['PROPERTY_CODE'] == 'HIDE_COMPANY') {
      $prop_check_id['HIDE_COMPANY'] = $item['ID'];
   }

   if ($item['PROPERTY_CODE'] == 'MODERATION') {
      if ($item['VALUE'] == 'На модерации') {
         $prop_check_id['MODERATION'] = $item['ID'];
      }
   }
}


// получение значений для фильтра специализация
if ($_POST['type'] == 'filter-specialisation') {
   $sections = \Bitrix\Iblock\SectionTable::getList(
      array(
         'filter' => array(
            'IBLOCK_ID' => 18,
            'DEPTH_LEVEL' => 2,
            'ACTIVE' => 'Y',
            'IBLOCK_SECTION_ID' => $_POST['category']
         ),
         'select' => array(
            'ID',
            'NAME'
         ),
         'order' => array(
            'NAME' => 'ASC'
         )
      )
   )->fetchAll();

   echo json_encode($sections, JSON_UNESCAPED_UNICODE);
}


if ($_POST['type'] == 'get-company-managers') {
   // Забираем компании с базы
   $companyList = [];
   $companyListArr = CIBlockElement::GetList(
      false,
      $arFilter = array("IBLOCK_ID" => 168, 'ACTIVE' => 'Y', 'CREATED_BY' => $USER->GetID()),
      false,
      false,
      $arSelectFields = array('ID', 'NAME', 'PROPERTY_COMP_TYPE_VALUE', 'PROPERTY_MANAGERS_ID')
   );
   // Вбиваем в переменную
   while ($arElement = $companyListArr->fetch()) {
      $companyList[] = $arElement;
   }

   $result = [];
   for ($i = 0; $i < count($companyList); $i++) {
      if (in_array($_POST['company_id'], $companyList[$i])) {
         foreach ($companyList[$i]['PROPERTY_MANAGERS_ID_VALUE'] as $key => $value) {
            $rsUser = CUser::GetByID($value);
            $arUser = $rsUser->Fetch();
            // $fio = $arUser['NAME'] . ' ' . $arUser['LAST_NAME'];
            if ($arUser['LAST_NAME']) {
               $fio = [
                  'id' => $arUser['ID'],
                  'name' => $arUser['NAME'],
                  'lastname' => $arUser['LAST_NAME'],
               ];
            } else {
               $fio = [
                  'id' => $arUser['ID'],
                  'name' => $arUser['NAME'],
               ];
            }
            $result[$key] = $fio;
         }
      }
   }
   echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

if ($_POST['type'] == 'get-company-data') {


   function raitingSum($arr)
   {
      $arrLength = count($arr);

      $result = 0;
      foreach ($arr as  $item) {
         $result = $result + $item;
      }

      return $result / $arrLength;
   }

   function getReviews()
   {
      $id = $_POST['company_id'];

      $reviews = [];
      Loader::includeModule("highloadblock");

      $hlbl = 292;
      $hlblock = HL\HighloadBlockTable::getById($hlbl)->fetch();

      $entity = HL\HighloadBlockTable::compileEntity($hlblock);
      $entity_data_class = $entity->getDataClass();

      $rsData = $entity_data_class::getList(array(
         "select" => array("*"),
         "order" => array("ID" => "ASC"),
         "filter" => array("UF_ID_COMPANY" => $id)
      ));
      while ($arData = $rsData->Fetch()) {
         $reviews[] = $arData['UF_RATING'];
      }
      return $reviews;
   }

   function getCompanyDate()
   {
      $id = $_POST['company_id'];

      $companyList = [];
      $companyListArr = CIBlockElement::GetList(
         false,
         $arFilter = array('ID' => $id, "IBLOCK_ID" => 168, 'ACTIVE' => 'Y'),
         false,
         false,
         $arSelectFields = array('DATE_CREATE')
      );
      // Вбиваем в переменную
      while ($arElement = $companyListArr->fetch()) {
         $companyList[] = $arElement;
      }

      $result = [];

      for ($i = 0; $i < count($companyList); $i++) {
         $result = $companyList[$i];
      }

      $result = explode('.', explode(' ', $result['DATE_CREATE'])[0]);

      $mounth = $result[1];
      $year = $result[2];

      switch ($mounth) {
         case '01':
            $mounth = 'января';
            break;
         case '02':
            $mounth = 'февраля';
            break;
         case '03':
            $mounth = 'марта';
            break;
         case '04':
            $mounth = 'апреля';
            break;
         case '05':
            $mounth = 'мая';
            break;
         case '06':
            $mounth = 'июня';
            break;
         case '07':
            $mounth = 'июля';
            break;
         case '08':
            $mounth = 'августа';
            break;
         case '09':
            $mounth = 'сентября';
            break;
         case '10':
            $mounth = 'ноября';
            break;
         case '11':
            $mounth = 'октября';
            break;
         case '12':
            $mounth = 'декабря';
            break;
      }

      $result = $mounth . ' ' . $year;

      return $result;
   }

   $result = [];

   $rating = count(getReviews()) > 0 ? raitingSum(getReviews()) : 0;
   $reviewsCount = count(getReviews()) > 0 ? count(getReviews()) : 0;
   $date = getCompanyDate();

   if (is_int($rating)) {
      $rating = (string)$rating;
      $rating = $rating . '.0';
   } else {
      $rating = round($rating, 1);
   }

   $result = [
      'raiting' => $rating,
      'reviews' => $reviewsCount,
      'date' => $date
   ];

   die(json_encode($result, JSON_UNESCAPED_UNICODE));
}

if ($_POST['type'] == 'create-company') {

   $result = [];

   $type_short = $_POST['type_short'];
   $type_full = $_POST['type_full'];

   $name = $_POST['name'];
   $name_full = $_POST['name_full'];

   $inn = $_POST['inn'];
   $kpp = $_POST['kpp'];
   $ogrn = $_POST['ogrn'];
   $ogrn_date = $_POST['ogrn_date'];
   $okved = $_POST['okved'];

   $address = $_POST['address'];
   $city = $_POST['city'];

   $ceo = $_POST['management']['name'];

   $status = $_POST['status'];

   $description = $_POST['companyDescription'];

   if (!isset($type_short) && !isset($name)) {
      $result = [
         'status' => 'error',
         'error' => 'Не найдены тип или имя организации',
      ];
      die(json_encode($result, JSON_UNESCAPED_UNICODE));
   }

   $el = new CIBlockElement;

   $arCompany = CIBlockElement::GetList(
      false,
      [
         'IBLOCK_ID' => 168,
         'PROPERTY_COMP_INN' => $inn,
      ],
      false,
      false,
      ['ID']
   )->Fetch()['ID'];

   if ($arCompany) {
      $result = [
         'status' => 'error',
         'error' => 'Данная компания уже существует',
      ];
      die(json_encode($result, JSON_UNESCAPED_UNICODE));
   }

   $PROP = [
      'MANAGERS_ID' => $USER->GetID(),

      'COMP_TYPE' => $type_short,
      'COMP_UR_NAME' => $name_full,
      'COMP_CITY' => $city,
      'COMP_UR_ADDR' => $address,
      'COMP_INN' => $inn,
      'COMP_KPP' => $kpp,
      'COMP_OGRN' => $ogrn,
      'COMP_OKVED' => $okved,
   ];

   $arrFile = array(
      "name" => $_FILES['file']['name'],
      "size" => $_FILES['file']['size'],
      "tmp_name" => $_FILES['file']['tmp_name'],
      "type" => $_FILES['file']['type'],
      "old_file" => "",
      "del" => "Y",
      "MODULE_ID" => "iblock"
   );

   $arLoadProductArray = array(
      "CREATED_BY"    => $USER->GetID(),
      "IBLOCK_SECTION_ID" => false,
      "IBLOCK_ID"      => 168,
      "PROPERTY_VALUES" => $PROP,
      "NAME"           => $name,
      "ACTIVE"         => "Y",
      "PREVIEW_TEXT"   => $description,
      "DETAIL_PICTURE" => $arrFile,
      "DETAIL_TEXT"    => '',
   );

   $PRODUCT_ID = $el->Add($arLoadProductArray);

   if ($PRODUCT_ID) {
      $result = [
         "ID" => $PRODUCT_ID,
         "status" => 'success',
         "name" => $type_short . ' ' . $name
      ];
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
   } else {
      $result = [
         'status' => 'error',
         'error' => "Error: " . $el->LAST_ERROR,
      ];
      die(json_encode($result, JSON_UNESCAPED_UNICODE));
   }
   die();
}

// Функционал Черновиков
// if ($_POST['type'] == 'draft-create') {

//    $data = json_decode($_POST['Data'], true);

//    $company = $data['Company'];
//    $cityList = $data['Cities'];
//    $vacancy = $data['Vacancy'];

//    $result = [];
//    $drafts_id = [];

//    foreach ($cityList as $key => $city) {
//       $el = new CIBlockElement;

//       $PROP = [
//          'DRAFT' => $prop_check_id['DRAFT'],
//          'COMP_ID' => $company['id'],
//          'HIDE_COMPANY' => $company['hide'],
//          'CITY_NEW' => $cityList[$key]['name'],
//          'LAT' => $cityList[$key]['lat'],
//          'LNG' => $cityList[$key]['lon'],
//          'PROFOBL' => $vacancy['specialization']['id']
//       ];

//       $arLoadProductArray = array(
//          "CREATED_BY"    => $USER->GetID(),
//          "IBLOCK_SECTION_ID" => false,
//          "IBLOCK_ID"      => 9,
//          "PROPERTY_VALUES" => $PROP,
//          "NAME"           => $vacancy['name'],
//          "ACTIVE"         => "N",
//          "PREVIEW_TEXT"   => $vacancy['description']['short'],
//          "DETAIL_PICTURE" => '',
//          "DETAIL_TEXT"    => $vacancy['description']['full'],
//       );

//       $drafts_id[] = $el->Add($arLoadProductArray);
//    }

//    foreach ($drafts_id as $key => $item) {
//       $step = $data['step'];

//       $company = $data['Company'];
//       $cityList = $data['Cities'];

//       if ($cityList[$key]['address']) {
//          $cityList[$key]['lat'] = $cityList[$key]['address']['lat'];
//          $cityList[$key]['lon'] = $cityList[$key]['address']['lon'];
//       }

//       $vacancy = $data['Vacancy'];

//       if ($vacancy['allow-temp'] == true) {
//          $vacancy['allow-temp'] = $prop_check_id['TEMP_ID'];
//       } else {
//          $vacancy['allow-temp'] = null;
//       }

//       if ($vacancy['income']['percent'] == true) {
//          $vacancy['income']['percent'] = $prop_check_id['PROCENT_ID'];
//       } else {
//          $vacancy['income']['percent'] = null;
//       }

//       if ($vacancy['hasCar'] == true) {
//          $vacancy['hasCar'] = $prop_check_id['HAS_AUTO_ID'];
//       } else {
//          $vacancy['hasCar'] = null;
//       }

//       if ($vacancy['only-with-message'] == true) {
//          $vacancy['only-with-message'] = $prop_check_id['ONLY_LETTER_ID'];
//       } else {
//          $vacancy['only-with-message'] = null;
//       }

//       if ($vacancy['manager']['send-to-mail'] == true) {
//          $vacancy['manager']['send-to-mail'] = $prop_check_id['NOTIFICATION_MANAGER_ID'];
//       } else {
//          $vacancy['manager']['send-to-mail'] = null;
//       }

//       if ($vacancy['notify']['enable'] == true) {
//          $vacancy['notify']['enable'] = $prop_check_id['AUTO_ANSWER_ID'];
//       } else {
//          $vacancy['notify']['enable'] = null;
//       }

//       $publication = $_POST['data']['Publication'];


//       // Забираем только ID режимов работы
//       $vacancy['working-mode'] = getIdFromArr($vacancy['working-mode'], 'id');
//       // Забираем только ID бонусов
//       $vacancy['bonus'] = getIdFromArr($vacancy['bonus'], 'id');
//       // Забираем только Значение бонусов
//       $vacancy['skills'] = getIdFromArr($vacancy['skills'], 'name');
//       // Форматируем данные языков в формат ID:LEVEL
//       $langId = getIdFromArr($vacancy['languages'], 'id');
//       $langLevel = getIdFromArr($vacancy['languages'], 'level');
//       $vacancy['languages'] = [];
//       foreach ($langId as $key => $item) {
//          $vacancy['languages'][] = $item . ':' . $langLevel[$key];
//       }
//       // Забираем только ID прав
//       $vacancy['drive-license'] = getIdFromArr($vacancy['drive-license'], 'id');
//       // Забираем только ID класса авто
//       $vacancy['car'] = getIdFromArr($vacancy['car'], 'id');
//       // Забираем только ID Какие соискатели могут откликаться
//       $vacancy['who-can'] = getIdFromArr($vacancy['who-can'], 'id');


//       $result = [];
//       $success = false;

//       $el = new CIBlockElement;

//       $PROP = [
//          'DRAFT' => $prop_check_id['DRAFT'],
//          'DRAFT_STEP' => $step,
//          'DRAFT_LINK' => implode(',', $drafts_id),

//          'COMP_ID' => $company['id'],
//          'HIDE_COMPANY' => $company['hide'],

//          'CITY_LIVE_ADDRESS' => $cityList[$key]['address']['address'],
//          'CITY_NEW' => $cityList[$key]['name'],
//          'LAT' => $cityList[$key]['lat'],
//          'LNG' => $cityList[$key]['lon'],

//          'PROFOBL' => $vacancy['specialization']['id'],

//          'GRAF' => $vacancy['busyness']['id'],
//          'GRAF_R' => $vacancy['schedule']['id'],
//          'WORK_FORMAT' => $vacancy['work-format']['id'],

//          'TEMP_REG' => $vacancy['allow-temp'],

//          'WORK_MODE' => $vacancy['working-mode'],

//          'ZARPLATA' => $vacancy['income']['from'],
//          'ZARPLATA_MAX' => $vacancy['income']['to'],
//          'SAL_PERIOD' => $vacancy['income']['period_id'],
//          'CURRENCY_TYPE' => $vacancy['income']['currency_id'],
//          'CHECK_PROCENT' => $vacancy['income']['percent'],
//          'TAX_DED' => $vacancy['income']['income_type_id'],

//          'ADD_COND' => $vacancy['bonus'],

//          'WORK_EXP' => $vacancy['experience']['id'],

//          'KEY_SKILLS' => $vacancy['skills'],

//          'FOREIGN_LANG' => $vacancy['languages'],

//          'DRIVER_LICENSE' => $vacancy['drive-license'],

//          'HAS_AUTO' => $vacancy['hasCar'],
//          'AUTO_CLASS' => $vacancy['car'],

//          'AVAILABLE_TO' => $vacancy['who-can'],

//          'ONLY_LETTER' => $vacancy['only-with-message'],

//          'MANAGER_ID' => $vacancy['manager']['id'],
//          'NOTIFICATION_MANAGER' => $vacancy['manager']['send-to-mail'],

//          'AUTO_ANSWER' => $vacancy['notify']['enable'],
//          'PATTERN_AUTO_ANSWER' => $vacancy['notify']['text'],

//          'PUB_TYPE' => $publication['publication-type']['id'],
//          'PUB_DATE' => $publication['timing']['ready'],

//          'IMAGES' => '',
//       ];


//       $arLoadProductArray = array(
//          "MODIFIED_BY"    => $USER->GetID(),
//          "IBLOCK_SECTION" => 9,
//          "PROPERTY_VALUES" => $PROP,
//          "NAME"           => $vacancy['name'],
//          "ACTIVE"         => "N",
//          "PREVIEW_TEXT"   => $vacancy['description']['short'],
//          "DETAIL_TEXT"    => $vacancy['description']['full'],
//          "DETAIL_PICTURE" => '',
//       );

//       $success = $el->Update($item, $arLoadProductArray);
//    }

//    $result = [
//       'ID' => $drafts_id,
//       'status' => 'Success'
//    ];

//    die(json_encode($result, JSON_UNESCAPED_UNICODE));
// }

if ($_POST['type'] == 'draft-create') {
   $data = json_decode($_POST['Data'], JSON_UNESCAPED_UNICODE);

   $company = $data['Company'];
   $cityList = $data['Cities'];
   $vacancy = $data['Vacancy'];

   $result = [];
   $status = [];

   foreach ($cityList as $key => $city) {
      $el = new CIBlockElement;

      if ($cityList[$key]['address']) {
         $cityList[$key]['lat'] = $cityList[$key]['address']['lat'];
         $cityList[$key]['lon'] = $cityList[$key]['address']['lon'];
      }

      // echo '<pre>';
      // print_r($cityList[$key]);
      // echo '</pre>';

      $vacancy = $data['Vacancy'];

      if ($vacancy['allow-temp'] == true) {
         $vacancy['allow-temp'] = $prop_check_id['TEMP_ID'];
      } else {
         $vacancy['allow-temp'] = null;
      }

      if ($vacancy['income']['percent'] == true) {
         $vacancy['income']['percent'] = $prop_check_id['PROCENT_ID'];
      } else {
         $vacancy['income']['percent'] = null;
      }

      if ($vacancy['hasCar'] == true) {
         $vacancy['hasCar'] = $prop_check_id['HAS_AUTO_ID'];
      } else {
         $vacancy['hasCar'] = null;
      }

      if ($vacancy['only-with-message'] == true) {
         $vacancy['only-with-message'] = $prop_check_id['ONLY_LETTER_ID'];
      } else {
         $vacancy['only-with-message'] = null;
      }

      if ($vacancy['manager']['send-to-mail'] == true) {
         $vacancy['manager']['send-to-mail'] = $prop_check_id['NOTIFICATION_MANAGER_ID'];
      } else {
         $vacancy['manager']['send-to-mail'] = null;
      }

      if ($vacancy['notify']['enable'] == true) {
         $vacancy['notify']['enable'] = $prop_check_id['AUTO_ANSWER_ID'];
      } else {
         $vacancy['notify']['enable'] = null;
      }

      $publication = $data['Publication'];


      // Забираем только ID режимов работы
      $vacancy['working-mode'] = getIdFromArr($vacancy['working-mode'], 'id');
      // Забираем только ID бонусов
      $vacancy['bonus'] = getIdFromArr($vacancy['bonus'], 'id');
      // Забираем только Значение бонусов
      $vacancy['skills'] = getIdFromArr($vacancy['skills'], 'name');
      // Форматируем данные языков в формат ID:LEVEL
      $langId = getIdFromArr($vacancy['languages'], 'id');
      $langLevel = getIdFromArr($vacancy['languages'], 'level');
      $vacancy['languages'] = [];
      foreach ($langId as $key => $item) {
         $vacancy['languages'][] = $item . ':' . $langLevel[$key];
      }
      // Забираем только ID прав
      $vacancy['drive-license'] = getIdFromArr($vacancy['drive-license'], 'id');
      // Забираем только ID класса авто
      $vacancy['car'] = getIdFromArr($vacancy['car'], 'id');
      // Забираем только ID Какие соискатели могут откликаться
      $vacancy['who-can'] = getIdFromArr($vacancy['who-can'], 'id');

      $el = new CIBlockElement;

      $fileId = [];
      if ($_FILES) {
         for ($i = 0; $i < count($_FILES['fileToUpload']['tmp_name']); $i++) {
            if ($_FILES['fileToUpload']['error'][$i] == UPLOAD_ERR_OK) {
               $arrFile = array(
                  "name" => $_FILES['fileToUpload']['name'][$i],
                  "size" => $_FILES['fileToUpload']['size'][$i],
                  "tmp_name" => $_FILES['fileToUpload']['tmp_name'][$i],
                  "type" => $_FILES['fileToUpload']['type'][$i],
                  "old_file" => "",
                  //"del" => "Y",
                  "MODULE_ID" => "iblock"
               );
               $fileId[] = CFile::SaveFile($arrFile, "iblock");
            }
         }
      }

      $PROP = [
         'MODERATION' => $prop_check_id['MODERATION'],

         'COMP_ID' => $company['id'],
         'HIDE_COMPANY' => $prop_check_id['HIDE_COMPANY'],

         'CITY_LIVE_ADDRESS' => $cityList[$key]['address']['address'],
         'CITY_NEW' => $cityList[$key]['name'],
         'LAT' => $cityList[$key]['lat'] != 'null' ? $cityList[$key]['lat'] : '',
         'LNG' => $cityList[$key]['lon'] != 'null' ? $cityList[$key]['lon'] : '',

         'PROFOBL' => $vacancy['specialization']['id'],

         'GRAF' => $vacancy['busyness']['id'],
         'GRAF_R' => $vacancy['schedule']['id'],
         'WORK_FORMAT' => $vacancy['work-format']['id'],

         'TEMP_REG' => $vacancy['allow-temp'],

         'WORK_MODE' => $vacancy['working-mode'],

         'ZARPLATA' => $vacancy['income']['from'],
         'ZARPLATA_MAX' => $vacancy['income']['to'],
         'SAL_PERIOD' => $vacancy['income']['period_id'],
         'CURRENCY_TYPE' => $vacancy['income']['currency_id'],
         'CHECK_PROCENT' => $vacancy['income']['percent'],
         'TAX_DED' => $vacancy['income']['income_type_id'],

         'ADD_COND' => $vacancy['bonus'],

         'WORK_EXP' => $vacancy['experience']['id'],

         'KEY_SKILLS' => $vacancy['skills'],

         'FOREIGN_LANG' => $vacancy['languages'],

         'DRIVER_LICENSE' => $vacancy['drive-license'],

         'HAS_AUTO' => $vacancy['hasCar'],
         'AUTO_CLASS' => $vacancy['car'],

         'AVAILABLE_TO' => $vacancy['who-can'],

         'ONLY_LETTER' => $vacancy['only-with-message'],

         'MANAGER_ID' => $vacancy['manager']['id'],
         'NOTIFICATION_MANAGER' => $vacancy['manager']['send-to-mail'],

         'AUTO_ANSWER' => $vacancy['notify']['enable'],
         'PATTERN_AUTO_ANSWER' => $vacancy['notify']['text'],

         'PUB_TYPE' => $publication['publication-type']['id'],
         'PUB_DATE' => $publication['timing']['ready'],

         'IMAGES' => $fileId,
      ];

      $arLoadProductArray = array(
         "CREATED_BY"    => $USER->GetID(),
         "IBLOCK_SECTION_ID" => false,
         "IBLOCK_ID"      => 9,
         "PROPERTY_VALUES" => $PROP,
         "NAME"           => $vacancy['name'],
         "ACTIVE"         => "N",
         "PREVIEW_TEXT"   => $vacancy['description']['short'],
         "DETAIL_PICTURE" => '',
         "DETAIL_TEXT"    => $vacancy['description']['full'],
      );

      $status = $el->Add($arLoadProductArray);
   }


   $result = [
      'ID' => $status,
      'status' => 'Success'
   ];

   die(json_encode($result, JSON_UNESCAPED_UNICODE));
}

if ($_POST['type'] == 'draft-update') {

   function qwe($data, $ids, $fileId)
   {
      global $prop_check_id;
      $step = $data['step'];


      $company = $data['Company'];
      $cityList = $data['Cities'];
      $vacancy = $data['Vacancy'];

      if ($vacancy['allow-temp'] == true) {
         $vacancy['allow-temp'] = $prop_check_id['TEMP_ID'];
      } else {
         $vacancy['allow-temp'] = null;
      }

      if ($vacancy['income']['percent'] == true) {
         $vacancy['income']['percent'] = $prop_check_id['PROCENT_ID'];
      } else {
         $vacancy['income']['percent'] = null;
      }

      if ($vacancy['hasCar'] == true) {
         $vacancy['hasCar'] = $prop_check_id['HAS_AUTO_ID'];
      } else {
         $vacancy['hasCar'] = null;
      }

      if ($vacancy['only-with-message'] == true) {
         $vacancy['only-with-message'] = $prop_check_id['ONLY_LETTER_ID'];
      } else {
         $vacancy['only-with-message'] = null;
      }

      if ($vacancy['manager']['send-to-mail'] == true) {
         $vacancy['manager']['send-to-mail'] = $prop_check_id['NOTIFICATION_MANAGER_ID'];
      } else {
         $vacancy['manager']['send-to-mail'] = null;
      }

      if ($vacancy['notify']['enable'] == true) {
         $vacancy['notify']['enable'] = $prop_check_id['AUTO_ANSWER_ID'];
      } else {
         $vacancy['notify']['enable'] = null;
      }

      $publication = $_POST['data']['Publication'];


      // Забираем только ID режимов работы
      $vacancy['working-mode'] = getIdFromArr($vacancy['working-mode'], 'id');
      // Забираем только ID бонусов
      $vacancy['bonus'] = getIdFromArr($vacancy['bonus'], 'id');
      // Забираем только Значение бонусов
      $vacancy['skills'] = getIdFromArr($vacancy['skills'], 'name');
      // Форматируем данные языков в формат ID:LEVEL
      $langId = getIdFromArr($vacancy['languages'], 'id');
      $langLevel = getIdFromArr($vacancy['languages'], 'level');
      $vacancy['languages'] = [];
      foreach ($langId as $key_lang => $lang) {
         $vacancy['languages'][] = $lang . ':' . $langLevel[$key_lang];
      }
      // Забираем только ID прав
      $vacancy['drive-license'] = getIdFromArr($vacancy['drive-license'], 'id');
      // Забираем только ID класса авто
      $vacancy['car'] = getIdFromArr($vacancy['car'], 'id');
      // Забираем только ID Какие соискатели могут откликаться
      $vacancy['who-can'] = getIdFromArr($vacancy['who-can'], 'id');

      $PROP = [
         'DRAFT' => $prop_check_id['DRAFT'],
         'DRAFT_STEP' => $step,
         'DRAFT_LINK' => implode(',', $ids),
         'COMP_ID' => $company['id'],
         'HIDE_COMPANY' => $company['hide'],



         'PROFOBL' => $vacancy['specialization']['id'],

         'GRAF' => $vacancy['busyness']['id'],
         'GRAF_R' => $vacancy['schedule']['id'],
         'WORK_FORMAT' => $vacancy['work-format']['id'],

         'TEMP_REG' => $vacancy['allow-temp'],

         'WORK_MODE' => $vacancy['working-mode'],

         'ZARPLATA' => $vacancy['income']['from'],
         'ZARPLATA_MAX' => $vacancy['income']['to'],
         'SAL_PERIOD' => $vacancy['income']['period_id'],
         'CURRENCY_TYPE' => $vacancy['income']['currency_id'],
         'CHECK_PROCENT' => $vacancy['income']['percent'],
         'TAX_DED' => $vacancy['income']['income_type_id'],

         'ADD_COND' => $vacancy['bonus'],

         'WORK_EXP' => $vacancy['experience']['id'],

         'KEY_SKILLS' => $vacancy['skills'],

         'FOREIGN_LANG' => $vacancy['languages'],

         'DRIVER_LICENSE' => $vacancy['drive-license'],

         'HAS_AUTO' => $vacancy['hasCar'],
         'AUTO_CLASS' => $vacancy['car'],

         'AVAILABLE_TO' => $vacancy['who-can'],

         'ONLY_LETTER' => $vacancy['only-with-message'],

         'MANAGER_ID' => $vacancy['manager']['id'],
         'NOTIFICATION_MANAGER' => $vacancy['manager']['send-to-mail'],

         'AUTO_ANSWER' => $vacancy['notify']['enable'],
         'PATTERN_AUTO_ANSWER' => $vacancy['notify']['text'],

         'PUB_TYPE' => $publication['publication-type']['id'],
         'PUB_DATE' => $publication['timing']['ready'],

         'IMAGES' => $fileId,
      ];

      $arLoadProductArray = array(
         "IBLOCK_SECTION" => 9,
         "NAME"           => $vacancy['name'],
         "ACTIVE"         => "N",
         "PREVIEW_TEXT"   => $vacancy['description']['short'],
         "DETAIL_TEXT"    => $vacancy['description']['full'],
         "DETAIL_PICTURE" => '',
      );

      foreach ($ids as $key => $item) {
         if ($cityList[$key]['address']) {
            $cityList[$key]['lat'] = $cityList[$key]['address']['lat'];
            $cityList[$key]['lon'] = $cityList[$key]['address']['lon'];
         }

         $result = [];

         $el = new CIBlockElement;

         $PROP['CITY_LIVE_ADDRESS'] = $cityList[$key]['address']['address'];
         $PROP['CITY_NEW'] = $cityList[$key]['name'];
         $PROP['LAT'] = $cityList[$key]['lat'];
         $PROP['LNG'] = $cityList[$key]['lon'];

         $arLoadProductArray['PROPERTY_VALUES'] = $PROP;
         $result[] = $el->Update($item, $arLoadProductArray);
      }
      return $ids;
   }

   $fileId = [];
   if ($_FILES) {
      for ($i = 0; $i < count($_FILES['fileToUpload']['tmp_name']); $i++) {
         if ($_FILES['fileToUpload']['error'][$i] == UPLOAD_ERR_OK) {
            $arrFile = array(
               "name" => $_FILES['fileToUpload']['name'][$i],
               "size" => $_FILES['fileToUpload']['size'][$i],
               "tmp_name" => $_FILES['fileToUpload']['tmp_name'][$i],
               "type" => $_FILES['fileToUpload']['type'][$i],
               "old_file" => "",
               //"del" => "Y",
               "MODULE_ID" => "iblock"
            );
            $fileId[] = CFile::SaveFile($arrFile, "iblock");
         }
      }
   }

   $data = json_decode($_POST['Data'], JSON_UNESCAPED_UNICODE);

   $oldCityList = json_decode($data['cityCount'], JSON_UNESCAPED_UNICODE);
   $newCityList = $data['Cities'];
   $tmp = [];
   $new_city = [];

   foreach ($oldCityList as $item) {
      $tmp[] = $item['name'];
   }

   for ($i = 0; $i < count($newCityList); $i++) {
      if (!in_array($newCityList[$i]['name'], $tmp)) {
         $new_city[] = $newCityList[$i];
      }
   }
   $ids = $data['ids'];
   $success = [];
   $ids_count = 0;

   foreach ($newCityList as $item) {
      $step = $data['step'];

      $company = $data['Company'];
      $cityList = $data['Cities'];

      if ($item['address']) {
         $item['lat'] = $item['address']['lat'];
         $item['lon'] = $item['address']['lon'];
      }

      $vacancy = $data['Vacancy'];

      if ($vacancy['allow-temp'] == true) {
         $vacancy['allow-temp'] = $prop_check_id['TEMP_ID'];
      } else {
         $vacancy['allow-temp'] = null;
      }

      if ($vacancy['income']['percent'] == true) {
         $vacancy['income']['percent'] = $prop_check_id['PROCENT_ID'];
      } else {
         $vacancy['income']['percent'] = null;
      }

      if ($vacancy['hasCar'] == true) {
         $vacancy['hasCar'] = $prop_check_id['HAS_AUTO_ID'];
      } else {
         $vacancy['hasCar'] = null;
      }

      if ($vacancy['only-with-message'] == true) {
         $vacancy['only-with-message'] = $prop_check_id['ONLY_LETTER_ID'];
      } else {
         $vacancy['only-with-message'] = null;
      }

      if ($vacancy['manager']['send-to-mail'] == true) {
         $vacancy['manager']['send-to-mail'] = $prop_check_id['NOTIFICATION_MANAGER_ID'];
      } else {
         $vacancy['manager']['send-to-mail'] = null;
      }

      if ($vacancy['notify']['enable'] == true) {
         $vacancy['notify']['enable'] = $prop_check_id['AUTO_ANSWER_ID'];
      } else {
         $vacancy['notify']['enable'] = null;
      }

      $publication = $_POST['data']['Publication'];


      // Забираем только ID режимов работы
      $vacancy['working-mode'] = getIdFromArr($vacancy['working-mode'], 'id');
      // Забираем только ID бонусов
      $vacancy['bonus'] = getIdFromArr($vacancy['bonus'], 'id');
      // Забираем только Значение бонусов
      $vacancy['skills'] = getIdFromArr($vacancy['skills'], 'name');
      // Форматируем данные языков в формат ID:LEVEL
      $langId = getIdFromArr($vacancy['languages'], 'id');
      $langLevel = getIdFromArr($vacancy['languages'], 'level');
      $vacancy['languages'] = [];
      foreach ($langId as $key => $lang) {
         $vacancy['languages'][] = $lang . ':' . $langLevel[$key];
      }
      // Забираем только ID прав
      $vacancy['drive-license'] = getIdFromArr($vacancy['drive-license'], 'id');
      // Забираем только ID класса авто
      $vacancy['car'] = getIdFromArr($vacancy['car'], 'id');
      // Забираем только ID Какие соискатели могут откликаться
      $vacancy['who-can'] = getIdFromArr($vacancy['who-can'], 'id');


      $result = [];

      $el = new CIBlockElement;

      $PROP = [
         'DRAFT' => $prop_check_id['DRAFT'],
         'DRAFT_STEP' => $step,
         'DRAFT_LINK' => implode(',', $ids),

         'COMP_ID' => $company['id'],
         'HIDE_COMPANY' => $company['hide'],

         'CITY_LIVE_ADDRESS' => $item['address']['address'],
         'CITY_NEW' => $item['name'],
         'LAT' => $item['lat'],
         'LNG' => $item['lon'],

         'PROFOBL' => $vacancy['specialization']['id'],

         'GRAF' => $vacancy['busyness']['id'],
         'GRAF_R' => $vacancy['schedule']['id'],
         'WORK_FORMAT' => $vacancy['work-format']['id'],

         'TEMP_REG' => $vacancy['allow-temp'],

         'WORK_MODE' => $vacancy['working-mode'],

         'ZARPLATA' => $vacancy['income']['from'],
         'ZARPLATA_MAX' => $vacancy['income']['to'],
         'SAL_PERIOD' => $vacancy['income']['period_id'],
         'CURRENCY_TYPE' => $vacancy['income']['currency_id'],
         'CHECK_PROCENT' => $vacancy['income']['percent'],
         'TAX_DED' => $vacancy['income']['income_type_id'],

         'ADD_COND' => $vacancy['bonus'],

         'WORK_EXP' => $vacancy['experience']['id'],

         'KEY_SKILLS' => $vacancy['skills'],

         'FOREIGN_LANG' => $vacancy['languages'],

         'DRIVER_LICENSE' => $vacancy['drive-license'],

         'HAS_AUTO' => $vacancy['hasCar'],
         'AUTO_CLASS' => $vacancy['car'],

         'AVAILABLE_TO' => $vacancy['who-can'],

         'ONLY_LETTER' => $vacancy['only-with-message'],

         'MANAGER_ID' => $vacancy['manager']['id'],
         'NOTIFICATION_MANAGER' => $vacancy['manager']['send-to-mail'],

         'AUTO_ANSWER' => $vacancy['notify']['enable'],
         'PATTERN_AUTO_ANSWER' => $vacancy['notify']['text'],

         'PUB_TYPE' => $publication['publication-type']['id'],
         'PUB_DATE' => $publication['timing']['ready'],

         'IMAGES' => $fileId,
      ];

      $arLoadProductArray = array(
         "IBLOCK_SECTION" => 9,
         "PROPERTY_VALUES" => $PROP,
         "NAME"           => $vacancy['name'],
         "ACTIVE"         => "N",
         "PREVIEW_TEXT"   => $vacancy['description']['short'],
         "DETAIL_TEXT"    => $vacancy['description']['full'],
         "DETAIL_PICTURE" => '',
      );
      $success = $el->Update($ids[$ids_count], $arLoadProductArray);

      if (!$success) {

         $el = new CIBlockElement;
         $arLoadProductArray = array(
            "CREATED_BY"    => $USER->GetID(),
            "IBLOCK_SECTION_ID" => false,
            "IBLOCK_ID"      => 9,
            "PROPERTY_VALUES" => $PROP,
            "NAME"           => $vacancy['name'],
            "ACTIVE"         => "N",
            "PREVIEW_TEXT"   => $vacancy['description']['short'],
            "DETAIL_PICTURE" => '',
            "DETAIL_TEXT"    => $vacancy['description']['full'],
         );

         $result_id = $el->Add($arLoadProductArray);
         $ids[] = $result_id;
      }
      $ids_count++;
   }
   $result = qwe($data, $ids, $fileId);

   die(json_encode($result));
}

if ($_POST['type'] == 'draft-open') {

   $idArr = $_POST['id'];

   $result = [];

   foreach ($idArr as $key => $item) {
      //Получение всех черновиков
      $arFilter = [
         'ID' => $item,
         'IBLOCK_ID' => 9,
         'CREATED_BY' => CUser::GetID(),
         '!=PROPERTY_DRAFT' => False,
      ];
      $arSelect = [
         'ID',
         'NAME',
         'PREVIEW_TEXT',
         'DETAIL_TEXT',
         'PROPERTY_CITY_NEW',
         'PROPERTY_PROFOBL',
         'PROPERTY_CITY_LIVE',
         'PROPERTY_CITY_LIVE_ADDRESS',
         'PROPERTY_ZARPLATA',
         'PROPERTY_ZARPLATA_MAX',
         'PROPERTY_SAL_PERIOD',
         'PROPERTY_ADD_COND',
         'PROPERTY_KEY_SKILLS',
         'PROPERTY_LAT',
         'PROPERTY_LNG',
         'PROPERTY_COMP_ID',
         'PROPERTY_GRAF',
         'PROPERTY_WORK_MODE',
         'PROPERTY_WORK_FORMAT',
         'PROPERTY_WORK_EXP',
         'PROPERTY_GRAF_R',
         'PROPERTY_DRIVER_LICENSE',
         'PROPERTY_AUTO_CLASS',
         'PROPERTY_AVAILABLE_TO',
         'PROPERTY_TAX_DED',
         'PROPERTY_MANAGER_ID',
         'PROPERTY_PUB_TYPE',
         "PROPERTY_FOREIGN_LANG",
         "PROPERTY_HOT_VAC",
         "PROPERTY_PREMIUM",
         "PROPERTY_PUB_DATE",
         "PROPERTY_ONLY_LETTER",
         'PROPERTY_HAS_AUTO',
         'PROPERTY_TEMP_REG',
         'PROPERTY_NOTIFICATION_MANAGER',
         'PROPERTY_AUTO_ANSWER',
         'PROPERTY_PATTERN_AUTO_ANSWER',
         'PROPERTY_CHECK_PROCENT',
         'PROPERTY_IMAGES',
         'PROPERTY_DRAFT_STEP',
         'PROPERTY_DRAFT_LINK',
         'PROPERTY_CURRENCY_TYPE'
      ];
      $draft = CIBlockElement::GetList(
         false,
         $arFilter,
         false,
         false,
         $arSelect
      );
      $arDraft = [];

      while ($arItem = $draft->Fetch()) {
         $arDraft[] = $arItem;
      }

      $result[] = $arDraft[0];
   }

   die(json_encode($result, JSON_UNESCAPED_UNICODE));
}


if ($_POST['type'] == 'getCategoryParser') {
   $specializations = $_POST['data'];

   foreach ($specializations as $item) {
      $spec[] = \Bitrix\Iblock\SectionTable::getList(
         array(
            'filter' => array(
               'IBLOCK_ID' => 18,
               'DEPTH_LEVEL' => 2,
               'ACTIVE' => 'Y',
               'NAME' => $item['name']
            ),
            'select' => array(
               'IBLOCK_SECTION_ID',
               'ID',
               'NAME'
            ),
            'order' => array(
               'NAME' => 'ASC'
            )
         )
      )->fetch();
   }

   $result = [];
   foreach ($spec as $item) {
      $result[] = $item['IBLOCK_SECTION_ID'];
   }
   $result = array_count_values($result);

   $profObl = \Bitrix\Iblock\SectionTable::getList(
      array(
         'filter' => array(
            'IBLOCK_ID' => 18,
            'DEPTH_LEVEL' => 1,
            'ACTIVE' => 'Y',
            'ID' => array_search(max($result), $result)
         ),
         'select' => array(
            'ID',
            'NAME'
         ),
         'order' => array(
            'NAME' => 'ASC'
         )
      )
   )->fetch();

   $specFull = \Bitrix\Iblock\SectionTable::getList(
      array(
         'filter' => array(
            'IBLOCK_ID' => 18,
            'DEPTH_LEVEL' => 2,
            'ACTIVE' => 'Y',
            'IBLOCK_SECTION_ID' => $profObl['ID']
         ),
         'select' => array(
            'ID',
            'NAME'
         ),
         'order' => array(
            'NAME' => 'ASC'
         )
      )
   )->fetchAll();
   $spec = [];


   foreach ($specializations as $key => $value) {

      foreach ($specFull as $item) {

         if (count($spec) == 0) {

            if ($item['NAME'] == $value['name']) {
               $spec[] = $item['ID'];
               $spec[] = $item['NAME'];
               break;
            }
         }
      }
   }

   $response = [
      'main' => $profObl,
      'spec' => $spec,
      'specFull' => $specFull
   ];

   die(json_encode($response, JSON_UNESCAPED_UNICODE));



























   foreach ($specializations as $item) {
      $spec[] = \Bitrix\Iblock\SectionTable::getList(
         array(
            'filter' => array(
               'IBLOCK_ID' => 18,
               'DEPTH_LEVEL' => 2,
               'ACTIVE' => 'Y',
               'NAME' => $item['name']
            ),
            'select' => array(
               'IBLOCK_SECTION_ID',
               'ID',
               'NAME'
            ),
            'order' => array(
               'NAME' => 'ASC'
            )
         )
      )->fetch();
   }

   $specialization = '';
   $temp = [];
   foreach ($spec as $item) {
      $temp[] = $item['ID'];
   }
   $temp = array_count_values($temp);

   // $profObl = \Bitrix\Iblock\SectionTable::getList(
   //    array(
   //       'filter' => array(
   //          'IBLOCK_ID' => 18,
   //          'DEPTH_LEVEL' => 1,
   //          'ACTIVE' => 'Y',
   //          'ID' => array_search(max($temp), $temp)
   //       ),
   //       'select' => array(
   //          'ID',
   //          'NAME'
   //       ),
   //       'order' => array(
   //          'NAME' => 'ASC'
   //       )
   //    )
   // )->fetch();




   $specFull = \Bitrix\Iblock\SectionTable::getList(
      array(
         'filter' => array(
            'IBLOCK_ID' => 18,
            'DEPTH_LEVEL' => 2,
            'ACTIVE' => 'Y',
            'ID' => array_search(max($temp), $temp)
         ),
         'select' => array(
            'ID',
            'NAME'
         ),
         'order' => array(
            'NAME' => 'ASC'
         )
      )
   )->fetchAll();

   echo '<pre>';
   print_r($specFull);
   echo '</pre>';
   die();
   foreach ($specFull as $item) {
      if ($item['NAME'] == $specializations[0]['profarea_name']) {
         $specialization = $item['ID'];
      }
   }
   die(json_encode($specialization));
}
