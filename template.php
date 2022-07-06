<?php

/**
 * Date: 05.06.2020
 * Time: 11:53
 * User: Ruslan Semagin
 * Company: PIXEL365
 * Web: https://pixel365.ru
 * Email: pixel.365.24@gmail.com
 * Phone: +7 (495) 005-23-76
 * Skype: pixel365
 * Product Page: https://marketplace.1c-bitrix.ru/solutions/democontent2.pi/
 * License Page: https://marketplace.1c-bitrix.ru/solutions/democontent2.pi/#tab-support-link
 * Use of this code is allowed only under the condition of full compliance with the terms of the license agreement,
 * and only as part of the product.
 */

define('NEED_AUTH', true);

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

\Bitrix\Main\Loader::includeModule('democontent2.pi');

use Bitrix\Main\Page\Asset;

$request = \Bitrix\Main\Application::getInstance()->getContext()->getRequest();
global $USER;

$type = $_GET['type'];

Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . '/lib/quill__text_editor/quill.snow.css');
Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . '/lib/ionRangeSlider/ion.rangeSlider.min.css');

Asset::getInstance()->addCss('https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');

Asset::getInstance()->addCss($this->GetFolder() . '../../../common/components.css', true);
Asset::getInstance()->addCss($this->GetFolder() . '../../../common/variables.css', true);
Asset::getInstance()->addCss($this->GetFolder() . '/css/style-new__vacancy-desktop.css', true);
Asset::getInstance()->addCss($this->GetFolder() . '/css/style-new__vacancy-desktop-media.css', true);
Asset::getInstance()->addCss($this->GetFolder() . '/css/update.css', true);

// Забираем компании с базы
$companyList = [];
$companyListArr = CIBlockElement::GetList(
   false,
   $arFilter = array("IBLOCK_ID" => 168, 'ACTIVE' => 'Y', 'CREATED_BY' => $USER->GetID()),
   false,
   false,
   $arSelectFields = array('ID', 'NAME', 'PROPERTY_COMP_TYPE', 'PROPERTY_MANAGERS_ID')
);
// Вбиваем в переменную
while ($arElement = $companyListArr->fetch()) {
   $companyList[] = $arElement;
}


$allProperty = [];

$property_enums = CIBlockPropertyEnum::GetList(array("ID" => "ASC", "SORT" => "ASC"), array("IBLOCK_ID" => 9));
while ($enum_fields = $property_enums->GetNext()) {
   $allProperty[] = $enum_fields;
}


$periodSalary = [];
$typeSalary = [];
$additionalConditions = [];
$workExp = [];
$graf = [];
$workSchedule = [];
$workMode = [];
$workFormat = [];
$driveCategory = [];
$autoCategory = [];
$availableTo = [];
$typePublication = [];
$currencyType = [];
$addsList = [];
$payType = [];
$salPeriod = [];

foreach ($allProperty as $key => $item) {
   //Получение свойств выплаты ЗП
   if ($item['PROPERTY_CODE'] == 'SAL_PERIOD') {
      $periodSalary[] = $item;
   }

   //Получение свойств вычета ЗП
   if ($item['PROPERTY_CODE'] == 'TAX_DED') {
      $typeSalary[] = $item;
   }

   //Получение свойств дополнительных условий
   if ($item['PROPERTY_CODE'] == 'ADD_COND') {
      $additionalConditions[] = $item;
   }

   //Получение свойств опыта работы
   if ($item['PROPERTY_CODE'] == 'WORK_EXP') {
      $workExp[] = $item;
   }

   //Получение свойств типа занятости
   if ($item['PROPERTY_CODE'] == 'GRAF') {
      $graf[] = $item;
   }

   //Получение свойств графика работы
   if ($item['PROPERTY_CODE'] == 'GRAF_R') {
      $workSchedule[] = $item;
   }

   //Получение свойств режима работы
   if ($item['PROPERTY_CODE'] == 'WORK_MODE') {
      $workMode[] = $item;
   }

   if ($item['PROPERTY_CODE'] == 'WORK_FORMAT') {
      $workFormat[] = $item;
   }

   //Получение свойств категории прав
   if ($item['PROPERTY_CODE'] == 'DRIVER_LICENSE') {
      $driveCategory[] = $item;
   }

   //Получение свойств категории авто
   if ($item['PROPERTY_CODE'] == 'AUTO_CLASS') {
      $autoCategory[] = $item;
   }

   //Получение свойств "Какие соискатели могут откликаться" 
   if ($item['PROPERTY_CODE'] == 'AVAILABLE_TO') {
      $availableTo[] = $item;
   }

   //Получение свойств типа публикации
   if ($item['PROPERTY_CODE'] == 'PUB_TYPE') {
      if ($item['VALUE'] == 'Бесплатно') {
         $typePublication[] = $item;
      }
   }

   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'CURRENCY_TYPE') {
      $currencyType[] = $item;
   }

   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'ADD_COND') {
      $addsList[] = $item;
   }

   //Получение свойств валют
   if ($item['PROPERTY_CODE'] == 'SAL_PERIOD') {
      $salPeriod[] = $item;
   }
}


//Получение всех черновиков
$arFilter = [
   'IBLOCK_ID' => 9,
   'CREATED_BY' => CUser::GetID(),
   '!=PROPERTY_DRAFT' => False,
];
$arSelect = [
   'ID',
   'TIMESTAMP_X',
   'NAME',
   'PROPERTY_DRAFT_LINK',
   'PROPERTY_CITY_NEW'
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

function array_unique_key($array, $key)
{
   $tmp = $key_array = array();
   $i = 0;

   foreach ($array as $val) {
      if (!in_array($val[$key], $key_array)) {
         $key_array[$i] = $val[$key];
         $tmp[$i] = $val;
      }
      $i++;
   }
   return $tmp;
}
$arDraft = array_unique_key($arDraft, 'PROPERTY_DRAFT_LINK_VALUE');

//Получение языков
$language = [];
$lang = CIBlockElement::GetList(
   ['SORT' => 'ASC'],
   ['IBLOCK_ID' => 19, 'ACTIVE' => 'Y'],
   false,
   ['nPageSize' => 9],
   ['NAME', 'ID']
);
while ($q = $lang->Fetch()) {
   $language[] = $q;
}


?>

<main class="main">
   <div class="container">
      <div class="main__wrapper">
         <section class="left__content">

            <div class="section-step step-1 " data-value="1">
               <h3 class="text-s24-h32-w500">Создание новой вакансии</h3>

               <div class="create__vacancy-link text-s14-h20-w400">
                  <!-- <a href="#">
                     <img src="<?= $this->GetFolder(); ?>/images/create__vacancy-link/item-1.svg" alt="link">
                     <p>Выбрать шаблон</p>
                  </a> -->
                  <a href="#" class="modal-trigger__open" data-modal="hh">
                     <img src="<?= $this->GetFolder(); ?>/images/create__vacancy-link/item-2.svg" alt="link">
                     <p>Скопировать с hh.ru</p>
                  </a>
                  <!-- <a href="#" class="modal-trigger__open" data-modal="draft">
                     <img src="/images/create__vacancy-link/item-3.svg" alt="link">
                     <p>Создать из черновика</p>
                  </a> -->
               </div>



               <div class="company">
                  <h5 class="text-s16-h22-w500">Компания</h5>
                  <div class="company__list text-s16-h22-w400">
                     <?
                     if (count($companyList) > 0) {
                        foreach ($companyList as $key => $item) {
                     ?>
                           <label class="company__list-item radio-btn" data-value="<?= $item['ID'] ?>" data-name="<?= $item['PROPERTY_COMP_TYPE_VALUE'] . ' ' . $item['NAME'] ?>">
                              <input type="radio" name="company" class="chose-company__input">
                              <span></span>
                              <p><?= $item['PROPERTY_COMP_TYPE_VALUE'] . ' ' . $item['NAME'] ?></p>
                           </label>
                     <?
                        }
                     }
                     ?>

                  </div>
                  <label class="company__switcher switcher-btn" data-value="" data-name="ООО AT-WORK">
                     <input type="checkbox">
                     <span></span>
                     <p>Скрыть название компании</p>
                  </label>
                  <p class="company__new text-s14-h20-w500">+ Создать новую компанию</p>
                  <p class="error-message text-s14-h20-w400 hide">Выберите компанию из списка или создайте новую</p>
               </div>

               <div class="locate__city">
                  <div class="title">
                     <h5 class="text-s16-h22-w500">Где искать сотрудника</h5>
                     <p class="title__prompt-icon"></p>
                     <p class="title__prompt-text text-s13-h16-w400">При указании нескольких городов вакансия
                        будет создана по каждому из них</p>
                  </div>
                  <div class="input">
                     <div class="input__inner">
                        <input class="text-s14-h20-w400" type="text" placeholder="Начните вводить город (один или несколько)">
                     </div>
                     <div class="input__list text-s14-h20-w400 hide">
                     </div>
                  </div>
                  <p class="error-message text-s14-h20-w400 hide">Введите название города</p>
                  <div class="add-items text-s15-h18-w400 hide">
                  </div>
               </div>

               <div class="locate__address dont-show" style="max-height: 30000px;">
                  <div class="title">
                     <h5 class="text-s16-h22-w500">Где будет работать сотрудник</h5>
                     <p class="title__prompt-icon"></p>
                     <p class="title__prompt-text text-s13-h16-w400">Добавьте точный адрес работы будущего сотрудника
                        или адрес головного офиса, если работа разъездная. Тогда вашу вакансию можно будет найти на
                        карте. Чем больше информации будет доступно вашим потенциальным сотрудникам, тем больше
                        откликов вы получите</p>
                  </div>
               </div>

               <div class="button">
                  <button class="clear-form text-s14-h20-w500">Очистить форму</button>

                  <button class="next text-s14-h20-w500">Далее</button>
               </div>
            </div>

            <div class="section-step step-2 hide" data-value="2">
               <div class="vacancy">
                  <div class="title">
                     <h5 class="text-s16-h22-w500">Название вакансии</h5>
                     <p class="title__prompt-icon"></p>
                     <p class="title__prompt-text text-s13-h16-w400">Это первое, что должно “зацепить” соискателя при
                        поиске вакансии. Сформулируйте название точно, чтобы была ясна суть работы.</p>
                  </div>
                  <input class="text-s14-h20-w400" type="text" placeholder="Например, Офис-менеджер" maxlength="100" minlength="5">
                  <p class="error-message hide text-s14-h20-w400">Укажите название вакансии</p>
               </div>

               <div class="specialisation">
                  <h6 class="text-s16-h22-w500">Специализация вакансии</h6>
                  <p class="error-message hide text-s14-h20-w400">Специализация не выбрана</p>
                  <div class="specialisation__list hide">
                     <p class="specialisation__item" data-value=""></p>
                     <span class="remove__btn"></span>
                  </div>
                  <p class="specialisation__change-btn text-s14-h20-w500">Указать</p>
               </div>

               <div class="short__description">
                  <div class="title">
                     <h5 class="text-s16-h22-w500">Краткое описание вакансии</h5>
                     <p class="title__prompt-icon"></p>
                     <p class="title__prompt-text text-s13-h16-w400">Расскажите кратко о вакансии: чтобы привлечь
                        будущего сотрудника: вы можете написать что нужно будет делать, какой будет график работы, а
                        также указать другие плюсы вашей вакансии</p>
                  </div>
                  <textarea class="short__description-text text-s14-h20-w400" placeholder="Краткое описание компании будет отображаться в карточке вакансии" maxlength="150"></textarea>
                  <p class="short__description-count text-s12-h14-w400">Символов: <span>0</span> из 150</p>
               </div>

               <div class="description">
                  <div class="title">
                     <h5 class="text-s16-h22-w500">Описание вакансии</h5>
                     <p class="title__prompt-icon"></p>
                     <p class="title__prompt-text text-s13-h16-w400">Составьте свое описание так, чтобы из текста
                        было понятно, что Вы предлагаете соискателю и какие требования его ждут. Подробно объясните
                        все пункты: укажите обязанности, требования, условия работы, предполагаемую зарплату, адрес
                        офиса, преимущества и перспективы этой работы. Так у Вас больше шансов найти нужного
                        сотрудника.</p>
                  </div>

                  <div class="description__editor">
                  </div>

                  <button class="description__clear"></button>

                  <p class="error-message hide text-s14-h20-w400">Описание вакансии не может быть менее 150
                     символов</p>

                  <p class="description__text-count text-s12-h14-w400">Символов: <span>0</span> из 3000</p>
               </div>

               <div class="button">
                  <div>
                     <button class="back text-s14-h20-w500">Назад</button>
                     <button class="clear-form text-s14-h20-w500">Очистить форму</button>
                  </div>

                  <button class="next text-s14-h20-w500">Далее</button>
               </div>
            </div>

            <div class="section-step step-3 hide" data-value="3">
               <div class="requirements">
                  <h6 class="text-s16-h22-w500">Условия работы</h6>
                  <div class="requirements__select text-s14-h20-w400">
                     <div class="employment">
                        <div class="employment__header">
                           <p class="item" data-value="" data-name="">Тип занятости</p>
                           <img src="<?= $this->GetFolder() ?>/images/arrow-select.svg" alt="arrow">
                        </div>
                        <div class="employment__list hide">
                           <?
                           foreach ($graf as $key => $item) {
                           ?>
                              <p class="item" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                           <?
                           }
                           ?>
                        </div>
                     </div>
                     <div class="schedule">
                        <div class="schedule__header">
                           <p class="item" data-value="" data-name="">График работы</p>
                           <img src="<?= $this->GetFolder() ?>/images/arrow-select.svg" alt="arrow">
                        </div>
                        <div class="schedule__list hide">
                           <?
                           foreach ($workSchedule as $key => $item) {
                           ?>
                              <p class="item" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                           <?
                           }
                           ?>
                        </div>
                     </div>
                     <div class="work-format">
                        <div class="work-format__header">
                           <p class="item" data-value="" data-name="">Формат работы</p>
                           <img src="<?= $this->GetFolder() ?>/images/arrow-select.svg" alt="arrow">
                        </div>
                        <div class="work-format__list hide">
                           <?
                           foreach ($workFormat as $key => $item) {
                           ?>
                              <p class="item" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                           <?
                           }
                           ?>
                        </div>
                     </div>
                  </div>

                  <div class="requirements__checkbox">
                     <label class="checkbox-btn">
                        <input type="checkbox">
                        <span></span>
                        <p class="text-s14-h20-w400">Возможно временное оформление</p>
                     </label>
                     <p class="requirements__checkbox-info"></p>
                     <p class="requirements__checkbox-prompt text-s14-h20-w400">Возможно оформление по ГПХ (услуги,
                        подряд, ИП, самозанятые) или совместительству
                     </p>
                  </div>
               </div>

               <div class="working__mode">
                  <h6 class="text-s16-h22-w500">Режим работы</h6>
                  <div class="working__mode-list">
                     <?
                     foreach ($workMode as $key => $item) {
                     ?>
                        <p class="item text-s12-h14-w400" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                     <?
                     }
                     ?>
                  </div>
               </div>

               <div class="income">
                  <h6 class="text-s16-h22-w500">Предполагаемый уровень дохода</h6>
                  <p class="income__promp text-s14-h20-w400">Введите одинаковые значения в поля “от” и “до” для
                     указания фиксированной заработной платы</p>

                  <div class="range-slider">
                     <input type="text" class="js-range-slider" value="" />
                  </div>

                  <div class="income__input">
                     <div class="from">
                        <input type="text" class="text-s12-h14-w400" maxlength="7">
                     </div>
                     <div class="upto">
                        <input type="text" class="text-s12-h14-w400" maxlength="7">
                     </div>
                     <div class="period__select">
                        <div class="period__select-header">
                           <p class="item text-s14-h20-w400" data-value="<?= $salPeriod[0]['ID'] ?>" data-name="<?= $salPeriod[0]['VALUE'] ?>"><?= $salPeriod[0]['VALUE'] ?></p>
                           <img src="<?= $this->GetFolder() ?>/images/arrow-select.svg" alt="arrow">
                        </div>
                        <div class="period__select-list hide">
                           <?
                           foreach ($salPeriod as $key => $item) {
                           ?>
                              <p class="item text-s14-h20-w400 active" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                           <?
                           }
                           ?>
                        </div>
                     </div>
                     <div class="currency__select">
                        <div class="currency__select-header">
                           <p class="item text-s14-h20-w400" data-value="" data-name="RUB">RUB</p>
                           <img src="<?= $this->GetFolder() ?>/images/arrow-select.svg" alt="arrow">
                        </div>
                        <div class="currency__select-list hide">

                           <?
                           foreach ($currencyType as $key => $item) {
                           ?>
                              <p class="item text-s14-h20-w400 <? $item['VALUE'] == 'RUB' ? 'active' : '' ?>" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                           <?
                           }
                           ?>

                        </div>
                     </div>
                  </div>
                  <div class="income__percent">
                     <label class="checkbox-btn">
                        <input type="checkbox">
                        <span></span>
                        <p class="text-s14-h20-w400">Процент (премиальные выплаты)</p>
                     </label>
                  </div>
                  <div class="income__additionally">
                     <?
                     foreach ($typeSalary as $key => $item) {
                     ?>
                        <label class="item radio-btn" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>" checked>
                           <?
                           if ($key == 0) {
                           ?>
                              <input type="radio" name="income__additionaly" checked>
                           <?
                           } else {
                           ?>
                              <input type="radio" name="income__additionaly">
                           <?
                           }
                           ?>
                           <span></span>
                           <p class="text-s14-h20-w400"><?= $item['VALUE'] ?></p>
                        </label>
                     <?
                     }
                     ?>
                  </div>
               </div>

               <div class="bonuses">
                  <h6 class="text-s16-h22-w500">Доступные бонусы</h6>
                  <div class="bonuses__list">

                     <?
                     foreach ($addsList as $key => $item) {
                     ?>
                        <p class="item text-s14-h20-w400" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                     <?
                     }
                     ?>

                  </div>
               </div>

               <div class="button">
                  <div>
                     <button class="back text-s14-h20-w500">Назад</button>
                     <button class="clear-form text-s14-h20-w500">Очистить форму</button>
                  </div>

                  <button class="next text-s14-h20-w500">Далее</button>
               </div>
            </div>

            <div class="section-step step-4 hide" data-value="4">
               <div class="experience">
                  <h6 class="text-s16-h22-w500">Опыт работы</h6>
                  <div class="experience__items">
                     <?
                     foreach ($workExp as $key => $item) {
                     ?>
                        <label class="item radio-btn" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>">
                           <input type="radio" name="experience-step-4">
                           <span></span>
                           <p class="text-s14-h20-w400"><?= $item['VALUE'] ?></p>
                        </label>
                     <?
                     }
                     ?>
                  </div>
               </div>

               <div class="skills">
                  <h6 class="text-s16-h22-w500">Ключевые навыки</h6>
                  <div class="skills__standart text-s14-h20-w400">
                     <p class="item">Уверенное владение компьютером</p>
                     <p class="item">Владение иностранными языками</p>
                     <p class="item">Проактивность</p>
                     <p class="item">Ведение переговоров</p>
                     <p class="item">Работа в команде</p>
                     <p class="item">Опыт продаж</p>
                     <p class="item">Умение расставлять приоритеты</p>
                     <p class="item">Внимание к деталям</p>
                  </div>
                  <div class="skills__input text-s14-h20-w400">
                     <input type="text" placeholder="Введите ключевые навыки" minlength="3" maxlength="60">
                     <div class="skills__input-list hide"></div>
                  </div>
                  <div class="skills__list text-s14-h20-w400 hide"></div>
               </div>

               <div class="languages__list text-s14-h20-w400">
                  <h6 class="text-s16-h22-w500">Знание языков</h6>
                  <div class="languages-native">
                     <div class="select-language">
                        <div class="header">
                           <p class="item" data-value="" data-name="">Выберите
                              язык</p>
                           <img src="<?= $this->GetFolder() ?>/images/arrow-select.svg" alt="arrow">
                        </div>
                        <div class="list hide">
                           <?
                           foreach ($language as $key => $item) {
                           ?>
                              <div class="item" data-value="<?= $item['ID'] ?>" data-name="<?= $item['NAME'] ?>">
                                 <?= $item['NAME'] ?>
                              </div>
                           <?
                           }
                           ?>
                        </div>
                     </div>
                     <div class="select-lavel">
                        <div class="header">
                           <p class="item" data-value="native" data-name="Родной">
                              Родной
                           </p>
                        </div>
                     </div>
                     <button class="remove-language"></button>
                  </div>
                  <?
                  if (count($language) > 1) {
                  ?>
                     <div class="languages one" data-count="0">
                        <div class="select-language">
                           <div class="header">
                              <p class="item" data-value="" data-name="">Выберите
                                 язык</p>
                              <img src="<?= $this->GetFolder() ?>/images/arrow-select.svg" alt="arrow">
                           </div>
                           <div class="list hide">
                              <?
                              foreach ($language as $key => $item) {
                              ?>
                                 <div class="item" data-value="<?= $item['ID'] ?>" data-name="<?= $item['NAME'] ?>">
                                    <?= $item['NAME'] ?>
                                 </div>
                              <?
                              }
                              ?>
                           </div>
                        </div>
                        <div class="select-lavel dont-click">
                           <div class="header">
                              <p class="item" data-value="" data-name="">
                                 Выберите уровень</p>
                              <img src="<?= $this->GetFolder() ?>/images/arrow-select.svg" alt="arrow">
                           </div>
                           <div class="list hide">
                              <div class="item" data-value="a1" data-name="A1 — начальный">
                                 A1 — начальный
                              </div>
                              <div class="item" data-value="a2" data-name="А2 – ниже среднего">
                                 А2 – ниже среднего
                              </div>
                              <div class="item" data-value="b1" data-name="В1 – средний">
                                 В1 – средний
                              </div>
                              <div class="item" data-value="b2" data-name="В2 – выше среднего">
                                 В2 – выше среднего
                              </div>
                              <div class="item" data-value="c1" data-name="C1 – продвинутый">
                                 C1 – продвинутый
                              </div>
                              <div class="item" data-value="c2" data-name="C2 – профессиональный">
                                 C2 – профессиональный
                              </div>
                           </div>
                        </div>
                        <button class="remove-language"></button>
                     </div>
                     <button class="add-language dont-click text-s14-h20-w500">+Добавить язык</button>
                  <?
                  }
                  ?>

               </div>

               <div class="driver__license">
                  <h6 class="text-s16-h22-w500">Категория прав</h6>
                  <div class="driver__license-list1">
                     <?
                     foreach ($driveCategory as $key => $item) {
                     ?>
                        <p class="item text-s12-h14-w400" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                     <?
                     }
                     ?>
                  </div>
                  <label class="driver__license-checkbox switcher-btn">
                     <input type="checkbox">
                     <span></span>
                     <p>Есть личный транспорт</p>
                  </label>
                  <div class="driver__license-list2 dont-click">
                     <?
                     foreach ($autoCategory as $key => $item) {
                     ?>
                        <p class="item text-s12-h14-w400" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                     <?
                     }
                     ?>
                  </div>
               </div>

               <div class="response__options">
                  <h6 class="text-s16-h22-w500">Какие соискатели могут откликаться</h6>
                  <div class="response__options-list">
                     <?
                     foreach ($availableTo as $key => $item) {
                     ?>
                        <p class="item text-s12-h14-w400" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>"><?= $item['VALUE'] ?></p>
                     <?
                     }
                     ?>

                  </div>
                  <label class="response__options-checkbox checkbox-btn">
                     <input type="checkbox">
                     <span></span>
                     <p class="text-s14-h20-w400">Только с сопроводительным письмом</p>
                  </label>
               </div>

               <div class="button">
                  <div>
                     <button class="back text-s14-h20-w500">Назад</button>
                     <button class="clear-form text-s14-h20-w500">Очистить форму</button>
                  </div>

                  <button class="next text-s14-h20-w500">Далее</button>
               </div>
            </div>

            <div class="section-step step-5 hide" data-value="5">
               <div class="contact__information">
                  <h6 class="text-s16-h22-w500">Контактная информация</h6>
                  <div class="contact__information-select text-s14-h20-w400">
                     <div class="contact__information-select-header">
                        <p class="item" data-value="" data-name="">Выберите менеджера вакансии
                        </p>
                        <img src="<?= $this->GetFolder() ?>/images/arrow-select.svg" alt="arrow">
                     </div>
                     <div class="contact__information-select-list hide">

                     </div>
                  </div>
                  <p class="error-message text-s14-h20-w400 hide">Поле должно быть заполнено</p>
                  <label class="checkbox-btn">
                     <input type="checkbox">
                     <span></span>
                     <p class="text-s14-h20-w400">Отправлять уведомления об откликах и сообщениях на почту менеджера
                     </p>
                  </label>
               </div>

               <div class="notification__applicant">
                  <div class="title">
                     <h5 class="text-s16-h22-w500">Оповещение соискателя о получении отклика</h5>
                     <p class="title__prompt-icon"></p>
                     <p class="title__prompt-text text-s13-h16-w400">Вы можете составить сообщение, которое будут
                        автоматически получать соискатели после отклика на вакансию. Например, поблагодарите
                        соискателя за интерес к вашей вакансии и сообщите примерное время ожидания ответа.</p>
                  </div>
                  <label class="switcher-btn">
                     <input type="checkbox">
                     <span></span>
                     <p class="text-s14-h20-w400">Включить автоответ</p>
                  </label>
                  <div class="notification__applicant-textarea dont-click">
                     <div class="text">
                        <div class="notification__applicant-editor">
                        </div>
                        <button class="notification__applicant-clear"></button>
                        <p class="notification__text-count text-s12-h14-w400">Символов: <span>0</span> из 1000</p>
                     </div>

                     <div class="variables">
                        <h6 class="text-s14-h20-w500">Переменные:</h6>
                        <div class="variables__inner">
                           <p class="variables__name text-s13-h16-w400" data-value="[Name]">Имя соискателя</p>
                           <p class="variables__vacancy text-s13-h16-w400" data-value="[Vacancy]">Вакансия</p>
                           <p class="variables__name-contact text-s13-h16-w400" data-value="[Name-contact]">Имя
                              контактного лица</p>
                           <p class="variables__phone text-s13-h16-w400" data-value="[Phone]">Телефон для связи</p>
                           <p class="variables__email text-s13-h16-w400" data-value="[Email]">Почта для связи</p>
                           <p class="variables__name-company text-s13-h16-w400" data-value="[Name-company]">Название
                              компании
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="button">
                  <div>
                     <button class="back text-s14-h20-w500">Назад</button>
                     <button class="clear-form text-s14-h20-w500">Очистить форму</button>
                  </div>

                  <button class="next text-s14-h20-w500">Далее</button>
               </div>
            </div>

            <div class="section-step step-6 hide" data-value="6">
               <h6 class="text-s16-h22-w500">Изображение</h6>
               <p class="description-text text-s13-h16-w400">Если вы хотите быстрее найти подходящего сотрудника,
                  нужно оформить вакансию как можно ярче, например, добавив красивые фото. Поставьте первым самое
                  эффектное. Два следующих будут опубликованы в карточке вакансии при подключении платной услуги
                  “Премиум”. В случае если у вас нет подходящих, в результатах поиска будет отображаться логотип
                  вашей компании. Если и его нет, то будет выводиться изображение “по умолчанию”.</p>
               <button class="info-btn text-s14-h20-w500">Как выглядит Премиум вакансия?</button>
               <form class="load__image" method="post" enctype="multipart/form-data" action="">
                  <input class="load__image-input" id="file-input" type="file" name="file" multiple accept="image/jpeg,image/png,image/svg">
                  <label class="load__image-label" id="dragdrop" for="file-input">
                     <img src="<?= $this->GetFolder() ?>/images/load__icon.svg">
                     <h6 class="text-s16-h22-w500">Нажмите на эту область чтобы загрузить изображения</h6>
                     <p class="text-s12-h14-w400">Jpeg, png, gif максимум: 10mb</p>
                  </label>
               </form>
               <p class="error-message text-s14-h20-w400 hide">Загружаемые файлы превышают допустимый размер</p>
               <div class="load__image-preview" id="files">
               </div>

               <div class="button">
                  <div>
                     <button class="back text-s14-h20-w500">Назад</button>
                     <button class="clear-form text-s14-h20-w500">Очистить форму</button>
                  </div>

                  <button class="next text-s14-h20-w500">Далее</button>
               </div>
            </div>

            <div class="section-step step-7 hide" data-value="7">
               <div class="type__publication">
                  <h6 class="text-s16-h22-w500">Тип публикации вакансии</h6>

                  <p class="error-message text-s14-h20-w400 hide">Выберите тип публикации
                  </p>
                  <div class="type__publication-list">

                     <?
                     foreach ($typePublication  as $key => $item) {
                        if ($item['VALUE'] == 'Горящая') {
                           $descr = 'Размещение в топе поиска и на главной странице';
                           $period = 'Срок 30 дней';
                           $price = '1 700 ₽';
                        } elseif ($item['VALUE'] == 'Автоподнятие') {
                           $descr = 'Без автообновления, поднятие в поиске каждые 3 дня';
                           $period = 'Срок 30 дней';
                           $price = '2 700 ₽';
                        } elseif ($item['VALUE'] == 'Премиум') {
                           $descr = 'Премиум вакансия имеет размер двух обычных объявлений в каталоге,
                           выделение цветом и две дополнительных картинки-превью плюс инфоблок о компании и подробное описание в
                           виде списка';
                           $period = 'Срок 30 дней';
                           $price = '3 700 ₽';
                        } else {
                           $descr = 'Без автообновления';
                           $period = 'Срок 30 дней';
                           $price = '';
                        }
                     ?>
                        <div class="item" data-value="<?= $item['ID'] ?>" data-name="<?= $item['VALUE'] ?>">
                           <label class="radio-btn">
                              <?
                              if ($key == 0) {
                              ?>
                                 <input type="checkbox" checked>
                              <?
                              } else {
                              ?>
                                 <input type="checkbox">
                              <?
                              }
                              ?>
                              <span></span>
                              <p class="text-s16-h22-w600"><?= $item['VALUE'] ?></p>
                           </label>
                           <p class="item__description text-s14-h20-w400"><?= $descr ?></p>
                           <p class="item__period text-s11-h14-w400"><?= $period ?></p>
                           <?
                           if (strlen($price) >= 2) {
                           ?>
                              <p class="item__price text-s16-h22-w500"><?= $price ?></p>
                           <?
                           }
                           ?>
                        </div>
                     <?
                     }
                     ?>
                  </div>
               </div>

               <div class="time__publication">
                  <div class="title">
                     <h5 class="text-s16-h22-w500">Время публикации вакансии</h5>
                     <p class="title__prompt-icon"></p>
                     <p class="title__prompt-text text-s13-h16-w400">Вы можете опубликовать вакансию сразу либо в
                        определенное время. Проверьте, чтобы все поля были заполнены корректно, объявление будет
                        проходить модерацию. В том случае, если вы размещаете платное объявление, проверьте состояние
                        счета, чтобы нужная сумма списалась в указанное вами время.</p>
                  </div>
                  <label class="time__publication-switcher switcher-btn">
                     <input type="checkbox">
                     <span></span>
                     <p class="text-s12-h14-w400">Опубликовать по расписанию</p>
                  </label>
                  <div class="time__publication-calendar dont-click">
                     <div class="calendar">
                        <input class="date__calendar text-s14-h20-w400" placeholder="Выбранная дата" disabled>
                     </div>
                     <div class="time text-s14-h20-w400 dont-click">
                        <div class="time__header">
                           <p class="item" data-from="" data-upto="" data-value="">Выберите время (+03:00 MSK)</p>
                        </div>
                        <div class="time__list">
                           <p class="item" data-from="00:00" data-upto="01:00" data-value="0">00:00 — 01:00</p>
                           <p class="item" data-from="01:00" data-upto="02:00" data-value="1">01:00 — 02:00</p>
                           <p class="item" data-from="02:00" data-upto="03:00" data-value="2">02:00 — 03:00</p>
                           <p class="item" data-from="03:00" data-upto="04:00" data-value="3">03:00 — 04:00</p>
                           <p class="item" data-from="04:00" data-upto="05:00" data-value="4">04:00 — 05:00</p>
                           <p class="item" data-from="05:00" data-upto="06:00" data-value="5">05:00 — 06:00</p>
                           <p class="item" data-from="06:00" data-upto="07:00" data-value="6">06:00 — 07:00</p>
                           <p class="item" data-from="07:00" data-upto="08:00" data-value="7">07:00 — 08:00</p>
                           <p class="item" data-from="08:00" data-upto="09:00" data-value="8">08:00 — 09:00</p>
                           <p class="item" data-from="09:00" data-upto="10:00" data-value="9">09:00 — 10:00</p>
                           <p class="item" data-from="10:00" data-upto="11:00" data-value="10">10:00 — 11:00</p>
                           <p class="item" data-from="11:00" data-upto="12:00" data-value="11">11:00 — 12:00</p>
                           <p class="item" data-from="12:00" data-upto="13:00" data-value="12">12:00 — 13:00</p>
                           <p class="item" data-from="13:00" data-upto="14:00" data-value="13">13:00 — 14:00</p>
                           <p class="item" data-from="14:00" data-upto="15:00" data-value="14">14:00 — 15:00</p>
                           <p class="item" data-from="15:00" data-upto="16:00" data-value="15">15:00 — 16:00</p>
                           <p class="item" data-from="16:00" data-upto="17:00" data-value="16">16:00 — 17:00</p>
                           <p class="item" data-from="17:00" data-upto="18:00" data-value="17">17:00 — 18:00</p>
                           <p class="item" data-from="18:00" data-upto="19:00" data-value="18">18:00 — 19:00</p>
                           <p class="item" data-from="19:00" data-upto="20:00" data-value="19">19:00 — 20:00</p>
                           <p class="item" data-from="20:00" data-upto="21:00" data-value="20">20:00 — 21:00</p>
                           <p class="item" data-from="21:00" data-upto="22:00" data-value="21">21:00 — 22:00</p>
                           <p class="item" data-from="22:00" data-upto="23:00" data-value="22">22:00 — 23:00</p>
                           <p class="item" data-from="23:00" data-upto="00:00" data-value="23">23:00 — 00:00</p>
                        </div>
                     </div>
                  </div>
                  <p class="time__publication-info text-s14-h20-w400">Ваша вакансия будет опубликована <span class="date">в ближайшее время</span> <span class="time"></span></p>
               </div>

               <label class="agreement checkbox-btn">
                  <input type="checkbox">
                  <span></span>

                  <p class="text-s12-h14-w400">Публикуя вакансию, Вы соглашаетесь с <a class="agreement__link text-s12-h14-w500" href="https://at-work.pro/personal-data/" target="_blank">правилами размещения вакансий</a></p>
               </label>



               <div class="button">
                  <div>
                     <button class="back text-s14-h20-w500">Назад</button>
                     <button class="clear-form text-s14-h20-w500">Очистить форму</button>
                  </div>

                  <div class="button__inner">
                     <button class="preview text-s14-h20-w500">Предпросмотр</button>
                     <button class="publish text-s14-h20-w500">Опубликовать</button>
                  </div>
               </div>
            </div>
         </section>

         <section class="right__content step">
            <div class="wrapper">
               <div class="step__value now" data-value="1">
                  <div class="number">
                  </div>
                  <p class="text text-s14-h20-w400">Локация и компания</p>
               </div>
               <div class="step__value" data-value="2">
                  <div class="number">
                  </div>
                  <p class="text text-s14-h20-w400">Основная информация</p>
               </div>
               <div class="step__value" data-value="3">
                  <div class="number">
                  </div>
                  <p class="text text-s14-h20-w400">Условия работы</p>
               </div>
               <div class="step__value" data-value="4">
                  <div class="number">
                  </div>
                  <p class="text text-s14-h20-w400">Требования</p>
               </div>
               <div class="step__value" data-value="5">
                  <div class="number">
                  </div>
                  <p class="text text-s14-h20-w400">Контакты</p>
               </div>
               <div class="step__value" data-value="6">
                  <div class="number">
                  </div>
                  <p class="text text-s14-h20-w400">Изображения</p>
               </div>
               <div class="step__value" data-value="7">
                  <div class="number">
                  </div>
                  <p class="text text-s14-h20-w400">Публикация</p>
               </div>
            </div>
         </section>
      </div>
   </div>
</main>

<div class="background ">
   <div class="popup__new-company ">
      <h4 class=" text-s24-h32-w500">Создать компанию</h4>
      <div class="form__input">
         <div class="image">
            <input class="image__upload" type="file" accept="image/jpeg,image/png,image/svg" />
            <img class="image__picture" src="" />
            <div class="image__plaseholder">
               <img src="<?= $this->GetFolder() ?>/images/popup__new-company/photo-icon.svg" alt="photo">
               <p class="text-s12-h14-w400">Логотип</p>
            </div>
            <button class="image__add"></button>
            <div class="image__add-menu">
               <p class="load text-s11-h14-w400">Загрузить новое</p>
               <p class="remove text-s11-h14-w400">Удалить</p>
            </div>
         </div>
         <div class="input-company">
            <input class="input__name text-s14-h20-w400" placeholder="Введите ИНН компании"></input>
            <div class="input__list hide"></div>
            <textarea class="input__description text-s14-h20-w400" placeholder="Краткое описание компании" maxlength='300'></textarea>
            <p class="input__description-count text-s12-h14-w400">Символов: <span>0</span> из 300</p>
         </div>
      </div>
      <div class="form__info text-s14-h20-w400 ">
         <div class="form__info-inner">
            <div class="name" id="create_title">
               <h5 class="text-s16-h22-w600"></h5>
               <p></p>
            </div>
            <div class="info">
               <div class="info__left">

                  <div class="legal__address" id="create_address">
                     <p class="title text-s12-h14-w400">Юридический адрес</p>
                     <p class="text"></p>
                  </div>

                  <div class="ceo" id="create_ceo">
                     <p class="title text-s12-h14-w400">Генеральный директор</p>
                     <div class="ceo__info">
                        <p class="ceo__info-name"></p>
                     </div>
                  </div>

               </div>
               <div class="info__right">
                  <div class="ogrn" id="create_ogrn">
                     <p class="title text-s12-h14-w400">ОГРН</p>
                     <div class="text">
                        <p class="ogrn-value"></p>
                        <p>от <span class="ogrn-date-value"></span></p>
                     </div>
                  </div>
                  <div class="tax__number" id="create_inn">
                     <p class="title text-s12-h14-w400">ИНН / КПП</p>
                     <div class="text">
                        <p class="inn-value"></p>
                        <p class="kpp-value"></p>
                     </div>
                  </div>
                  <div class="status" id="create_status">
                     <p class="title text-s12-h14-w400">Статус</p>
                     <p class="text"></p>
                  </div>

               </div>
            </div>
         </div>
         <div class="prompt">
            <p class="prompt__icon"></p>
            <p class="prompt__title text-s13-h16-w400">Возможно редактирование</p>
            <p class="prompt__text text-s13-h16-w400">Если информация неактуальна, вы можете отредактировать её
               в личном кабинете</p>
         </div>
      </div>
      <button class="save-btn text-s14-h20-w500">Сохранить</button>
      <img class="close-popup" src="<?= $this->GetFolder() ?>/images/close-popup.svg" alt="close">
   </div>

   <div class="popup__new-address">
      <h4 class=" text-s24-h32-w500">Добавить новый адрес</h4>
      <div class="input__address">
         <input type="text" placeholder="Найти адрес или объект" maxlength="150">
      </div>
      <div class="popup__new-address-inner">
         <div class="list">
            <div class="list-inner text-s14-h20-w400">
            </div>
         </div>
         <div class="active__item">
            <div class="active__item-inner text-s14-h20-w400">
               <div class="active__item-address">
                  <p class="title text-s12-h16-w400">Адрес</p>
                  <p class="name text-s14-h20-w400"></p>
               </div>
               <div class="active__item-metro">
                  <p class="title text-s12-h16-w400">Выберите ближайшее метро</p>
                  <label class="checkbox-btn" data-value="" data-name="ООО AT-WORK">
                     <input type="checkbox">
                     <span></span>
                     <p class="color" style="display: none;"></p>
                     <p>Адмиралтейская</p>
                  </label>
                  <label class="checkbox-btn" data-value="" data-name="ООО AT-WORK">
                     <input type="checkbox">
                     <span></span>
                     <p class="color" style="display: none;"></p>
                     <p>Балтийская</p>
                  </label>
               </div>
               <div class="active__item-additionally">
                  <p class="title text-s12-h16-w400">Дополнительная информация для приглашённого соискателя</p>
                  <textarea maxlength="200" placeholder="Ваш комментарий к адресу (номер офиса и прочее)"></textarea>
               </div>
            </div>
            <div class="active__item-button">
               <button class="cancel text-s14-h20-w400">Отменить</button>
               <button class="add text-s14-h20-w500">Добавить</button>
            </div>
         </div>
         <div class="map active ">
            <div class="map__resize">
               <button class="increase"></button>
               <button class="decrease"></button>
            </div>
            <button class="map__location"></button>
         </div>
      </div>
      <img class="close-popup" src="<?= $this->GetFolder() ?>/images/close-popup.svg" alt="close">
   </div>

   <div class="popup__categories">
      <h5 class="text-s28-h36-w500">Выберите основную профобласть</h5>
      <?
      $prof = \Bitrix\Iblock\SectionTable::getList(
         array(
            'filter' => array(
               'IBLOCK_ID' => 18,
               'DEPTH_LEVEL' => 1,
               'ACTIVE' => 'Y'
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
      ?>

      <ul>
         <?
         foreach ($prof as $key => $item) {
         ?>
            <li class="item" data-value="<?= $item['ID'] ?>" title="<?= $item['NAME'] ?>">
               <img src="<?= $this->GetFolder() ?>/images/popup__categories/icon-<?= $key ?>.svg" alt="icon">
               <p class="text-s14-h20-w400"><?= $item['NAME'] ?></p>
            </li>
         <?
         }
         ?>
      </ul>
      <div class="popup__categories-btn">
         <button class="clear text-s14-h20-w500" disabled>Сбросить</button>
         <button class="next text-s14-h20-w500" disabled>Далее</button>
         <button class="search text-s14-h20-w500 hide" disabled>Поиск</button>
      </div>
      <img class="close-popup" src="<?= $this->GetFolder() ?>/images/close-popup.svg" alt="close">
   </div>

   <div class="popup__specialisation">
      <button class="btn-back"></button>
      <h5 class="text-s24-h32-w500">Выберите специализацию</h5>
      <p class="categories-active text-s16-h22-w400"></p>
      <ul>



      </ul>
      <div class="popup__specialisation-btn">
         <button class="clear text-s14-h20-w500">Сбросить</button>
         <button class="save text-s14-h20-w500">Сохранить</button>
      </div>
      <img class="close-popup" src="<?= $this->GetFolder() ?>/images/close-popup.svg" alt="close">
   </div>

   <div class="popup__info-premium">
      <h4 class="text-s24-h32-w500">Премиум вакансия</h4>

      <div class="inner">
         <p class="text-s14-h20-w400">Как привлечь внимание к своему объявлению? Сделайте его ярче и выразительнее. В
            этом вам поможет платная услуга “Премиум”. Ваше объявление будет заметно выделяться среди остальных.</p>
         <p class="text-s14-h20-w400">Ваша вакансия приобретает размер двух обычных объявлений в каталоге и цветной
            контур, а еще вы можете опубликовать два дополнительных изображения-превью, которые станут дополнительным
            визуальным описанием вакансии. Согласитесь, такое объявление намного привлекательнее обычного?</p>
         <h5 class="text-s16-h22-w400">Пример пермиум вакансии в табличном виде</h5>
         <img src="<?= $this->GetFolder() ?>/images/popup__info-premium/column-image.svg" alt="image">
         <h5 class="text-s16-h22-w400">Пример пермиум вакансии в виде списка</h5>
         <img src="<?= $this->GetFolder() ?>/images/popup__info-premium/row-image.svg" alt="image">
         <p class="text-s14-h20-w400">Когда соискатель находится в поиске, ему важно изучить все нюансы работы:
            описание должности, заработная плата, адрес. Все это он может увидеть в премиум-объявлении, у которого
            есть подробное описание, а предполагаемая з/п вынесена в отдельную часть объявления и выделена цветом.
            Чем дольше соискатель задерживается на вашем объявлении, тем выше шансы, что он откликнется.</p>
      </div>
      <img class="close-popup" src="<?= $this->GetFolder() ?>/images/close-popup.svg" alt="close">
   </div>

   <div class="popup__preview">
      <div class="inner">
         <div class="basic__information">
            <div class="basic__information-left">
               <h5 class="vacancy__name text-s20-h24-w500"></h5>

               <div class="vacancy__location text-s14-h20-w400"></div>

               <div class="requirements text-s12-h14-w400">
                  <div class="experience hide">
                     <p class="name">Опыт работы</p>
                     <p class="value"></p>
                  </div>
                  <div class="employment hide">
                     <p class="name">Занятость</p>
                     <p class="value"></p>
                  </div>
                  <div class="schedule hide">
                     <p class="name">График работы</p>
                     <p class="value"></p>
                  </div>
               </div>

               <div class="working__mode text-s12-h14-w400 hide">
                  <p class="name">Режим работы</p>
                  <div class="value"></div>
               </div>

               <p class="temporary__clearance text-s12-h14-w400 hide">Возможно временное оформление</p>
            </div>

            <div class="basic__information-right">
               <div class="income">
                  <p class="income__value text-s24-h32-w500"></p>
                  <p class="income__info text-s12-h14-w400">До вычета налогов</p>
               </div>

               <div class="company">
                  <div class="company__logo">
                     <img src="<?= $this->GetFolder() ?>/images/load__icon.svg" alt="logo">
                  </div>
                  <div class="company__info">
                     <h6 class="company__info-name text-s18-h22-w500"></h6>
                     <div class="company__info-dopinfo">
                        <div class="rating">
                           <img src="<?= $this->GetFolder() ?>/images/rating.svg" alt="rating">
                           <p class="text-s12-h14-w400">5.0</p>
                        </div>
                        <div class="reviews">
                           <img src="<?= $this->GetFolder() ?>/images/reviews.svg" alt="reviews">
                           <p class="text-s12-h14-w400">6 отзывов</p>
                        </div>
                     </div>
                     <p class="company__info-registration text-s12-h14-w400">На AT-WORK с февраля 2021</p>
                  </div>
               </div>
            </div>
         </div>

         <div class="description ">
            <h5 class="text-s16-h22-w600">Описание вакансии</h5>
            <div class="description__text"></div>
         </div>

         <div class="bonuses hide">
            <h5 class="text-s16-h22-w600">Доступные бонусы:</h5>
            <li class="bonuses__value text-s14-h20-w400"></li>
         </div>

         <div class="additional__requirements hide">
            <h5 class="text-s16-h22-w600">Дополнительные требования</h5>
            <div class="skill hide">
               <h6 class="text-s14-h20-w500">Ключевые навыки</h6>
               <div class="skill__value"></div>
            </div>
            <div class="languages hide">
               <h6 class="text-s14-h20-w500">Знание языков</h6>
               <div class="languages__value text-s14-h20-w400">
               </div>
            </div>
            <div class="driver__license hide">
               <h6 class="text-s14-h20-w500">Водительское удостоверение</h6>
               <div class="driver__license-value">
                  <p class="name text-s14-h20-w400">Категория</p>
                  <div class="value text-s14-h20-w400"></div>
               </div>
            </div>
            <p class="having__car text-s14-h20-w500 hide">Наличие автомобиля обязательно</p>
            <div class="car__class text-s14-h20-w400 hide">
               <p class="name">Класс авто</p>
               <div class="value"></div>
            </div>
            <div class="response__options  text-s14-h20-w400 hide">
               <p class="item hide" data-name="С инвалидностью">Доступно соискателям с инвалидностью</p>
               <p class="item hide" data-name="Без резюме">Доступно соискателям без резюме</p>
               <p class="item hide" data-name="Возрастом от 14 лет">Доступно соискателям возрастом от 14 лет</p>
            </div>
         </div>

         <div class="vacancy__photo hide">
            <h5 class="text-s16-h22-w600">Фото вакансии</h5>
            <div class="vacancy__photo-preview"></div>
         </div>
      </div>
      <img class="close-popup" src="<?= $this->GetFolder() ?>/images/close-popup.svg" alt="close">
   </div>

   <div class="popup__publication">
      <img src="<?= $this->GetFolder() ?>/images/success__icon.svg" alt="success">
      <h5 class="text-s18-h22-w500">Вакансия <span>Название вакансии</span> будет опубликована после проверки
         модератором</h5>
      <div class="popup__publication-btn">
         <a href="#" class="home-page text-s14-h20-w400">Поднять просмотры</a>
         <a href="#" class="my-vacancy text-s14-h20-w500">Мои вакансии</a>
      </div>
   </div>
</div>

<div class="mtModal-overlay modal-trigger__close"></div>

<!-- <div class="mtModal modal-draft">
   <div class="mtModal-inner">
      <div class="mtModal-inner__title text-s24-h32-w500">
         Вакансия из черновика
      </div>

      <div class="mtModal-inner-body">
         <div class="mtModal-inner-body__list">
            <?
            foreach ($arDraft as $item) {
            ?>
               <label class="item" data-value="<?= str_replace('"', '`', $item['PROPERTY_DRAFT_LINK_VALUE']) ?>" data-name="<?= $item['NAME'] ?>">
                  <input type="radio" name="draft-chose" class="item__hidden">
                  <div class="item-visible">
                     <span class="item-visible__input"></span>
                     <div class="item-visible-text">
                        <span class="item-visible-text__title text-s16-h24-w400"><?= $item['NAME'] ?></span>
                        <span class="item-visible-text__subtitle text-s12-h14-w400">сохранена сегодня в <?= $item['TIMESTAMP_X'] ?></span>
                     </div>
                  </div>
               </label>
            <?
            }
            ?>
         </div>
      </div>

      <div class="mtModal-inner-actions text-s14-h20-w500">
         <button class="button-gray-transparent modal-trigger__close">Отмена</button>
         <button class="button-orange-fill">Выбрать</button>
      </div>
   </div>
</div> -->

<div class="mtModal modal-hh">
   <div class="mtModal-inner">
      <div class="mtModal-inner__title text-s24-h32-w500">
         <p class="text-s24-h32-w500">Разместить вакансию с hh.ru</p>
         <p class="mtModal-inner__title-description text-s14-h20-w400">Вставьте скопированную ссылку на Вашу вакансию, все поля формы заполнятся автоматически</p>
      </div>

      <div class="mtModal-inner-body">
         <div class="mtModal-inner-body__list">
            <label for="link-hh" class="link-hh">
               <input type="text" class="link-hh-input text-s14-h20-w400" name="link-hh" placeholder="Ссылка на вакансию, опубликованню на hh.ru">
               <span class="link-hh-button text-s14-h20-w500">Загрузить</span>
            </label>

         </div>
      </div>
   </div>
</div>

<div class="error-popup hide">
   <div class="error-popup-inner">
      <span class="error-popup-inner__icon">
         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.0002" cy="10" r="10" fill="#FF383C" />
            <path d="M14.3325 7.59129C14.6964 7.22743 14.6964 6.63748 14.3325 6.27362L14.1342 6.07531C13.7703 5.71144 13.1804 5.71144 12.8165 6.07531L10.0221 8.86976L7.2276 6.07531C6.86374 5.71144 6.27379 5.71144 5.90993 6.07531L5.71162 6.27362C5.34775 6.63748 5.34775 7.22743 5.71162 7.59129L8.50607 10.3857L5.71162 13.1802C5.34775 13.5441 5.34775 14.134 5.71162 14.4979L5.90993 14.6962C6.27379 15.06 6.86374 15.06 7.2276 14.6962L10.0221 11.9017L12.8165 14.6962C13.1804 15.06 13.7703 15.06 14.1342 14.6962L14.3325 14.4979C14.6964 14.134 14.6964 13.5441 14.3325 13.1802L11.538 10.3857L14.3325 7.59129Z" fill="white" />
         </svg>
      </span>
      <p class="error-popup-inner__description text-s14-h20-w400" id="error_print"></p>
   </div>
</div>



<script>
   var userId = <?= CUser::GetID() ? CUser::GetID() : 0 ?>;
   var templatePath = '<?= $this->GetFolder() ?>'
</script>



<script src="<?= SITE_TEMPLATE_PATH . '/lib/quill__text_editor/quill.js' ?>"></script>
<script src="<?= SITE_TEMPLATE_PATH . '/lib/ionRangeSlider/ion.rangeSlider.min.js' ?>"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://npmcdn.com/flatpickr/dist/l10n/ru.js"></script>

<script type="module" src="<?= $this->GetFolder() ?>/script.js?<?= time() ?>"></script>

<script type="module" src="<?= $this->GetFolder() ?>/js/script__load-step.js?<?= time() ?>"></script>
<script type="module" src="<?= $this->GetFolder() ?>/js/script__step-1.js?<?= time() ?>"></script>
<script type="module" src="<?= $this->GetFolder() ?>/js/script__step-2.js?<?= time() ?>"></script>
<script type="module" src="<?= $this->GetFolder() ?>/js/script__step-3.js?<?= time() ?>"></script>
<script type="module" src="<?= $this->GetFolder() ?>/js/script__step-4.js?<?= time() ?>"></script>
<script type="module" src="<?= $this->GetFolder() ?>/js/script__step-5.js?<?= time() ?>"></script>
<script type="module" src="<?= $this->GetFolder() ?>/js/script__step-6.js?<?= time() ?>"></script>
<script type="module" src="<?= $this->GetFolder() ?>/js/script__step-7.js?<?= time() ?>"></script>
<script type="module" src="<?= $this->GetFolder() ?>/js/script__preview.js?<?= time() ?>"></script>