<?

// Копируем вакансию с hh 
// Кнопка "Перенести с hh"

$list = explode('/', $_POST['url']);
foreach ($list as $item) {
    preg_match_all("/\d+/", $item, $result);
}
$id = $result[0][0];
$url = 'https://api.hh.ru/vacancies/' . $id . '?host=hh.ru';

$headers = [];


function curlGetPage($url, $referer = 'https://google.com/')
{
    $headers[] = "User-Agent:Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13";
    $headers[] = "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    $headers[] = "Accept-Language:en-us,en;q=0.5";
    $headers[] = "Accept-Encoding:gzip,deflate";
    $headers[] = "Accept-Charset:ISO-8859-1,utf-8;q=0.7,*;q=0.7";
    $headers[] = "lang:ru";
    $headers[] = "Keep-Alive:115";
    $headers[] = "Connection:keep-alive";
    $headers[] = "Cache-Control:max-age=0";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_ENCODING, "gzip");
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_REFERER, $referer);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

die(curlGetPage($url));
