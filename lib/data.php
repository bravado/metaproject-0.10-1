<?php
/**
 * Metaproject Compendium
 *
 * Datasource mock which stores data on a session variable
 *
 *
 *
 */

session_start();

// Initialize structures
if (!isset($_SESSION['DATA'])) {
    $_SESSION['DATA'] = array();
    $_SESSION['SEQ'] = 1;
}



function parse_post_body($decoded = true) {

    switch($_SERVER['REQUEST_METHOD']) {

        case 'POST':
            if (!empty($_POST)) {
                return $_POST;
            };
        case 'PUT':
            $post_body = file_get_contents('php://input');
            if(strlen($post_body) > 0 && $decoded) {
                if($post_body[0] == '{' || $post_body[0] == '[') {
                    return json_decode($post_body, true);
                }
                else {
                    parse_str($post_body, $return);
                    return $return;
                }
            }
            else {
                return $post_body;
            }
    }
}

// handle the request
try {
    $id = isset($_SERVER['PATH_INFO']) ? substr($_SERVER['PATH_INFO'], 1) : null;

    if($id == 'reset') {
        $_SESSION['DATA'] = array();
        $_SESSION['SEQ'] = 1;
        exit('{ "ok" : "1" }');
    }

    $ret = array();

    switch ($_SERVER['REQUEST_METHOD']) {

        case 'POST':
            $data = parse_post_body();


            if(isset($data['id'])) {
                if(isset($_SESSION['DATA'][$data['id']])) {
                    throw new Exception("Conflict", 409);
                }
                else {
                    if(is_numeric($data['id'])) {
                        if($data['id'] >= $_SESSION['SEQ']) {
                            $_SESSION['SEQ'] = $data['id'] + 1;
                        }

                    }
                }
            }
            else {
                $data['id'] = $_SESSION['SEQ']++;
            }
            $_SESSION['DATA'][$data['id']] = $data;

            $ret = array('id' => $data['id']);
            break;
        case 'PUT':
            $data = parse_post_body();

            if(isset($_SESSION['DATA'][$id])) {
                $_SESSION['DATA'][$id] = array_merge($_SESSION['DATA'][$id], $data);
                $ret = array("id" => $id);
            }
            else {
                throw new Exception("Invalid resource", 404);
            }
            break;
        case 'DELETE':

            if (isset($_SESSION['DATA'][$id])) {
                unset($_SESSION['DATA'][$id]);
                $ret = array("ok" => 1);
            }
            else {
                throw new Exception("Invalid resource", 404);
            }

            break;
        case 'GET':
            if (!empty($id)) {

                if (isset($_SESSION['DATA'][$id])) {
                    $ret = $_SESSION['DATA'][$id];
                } else {
                    throw new Exception("Not found", 404);
                }
            } else {

                if(isset($_GET['count'])) {
                    $ret = array(
                        'count' => count($_SESSION['DATA']));
                }
                else {
                    $ret = array_values($_SESSION['DATA']);
                }
            }
            break;
        default:
            throw new Exception("Invalid method");
            break;

    }

    echo json_encode($ret);
} catch (Exception $ex) {
    header('HTTP/1.0 ' . $ex->getCode());
    exit($ex->getMessage());
}