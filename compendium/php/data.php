<?php
/**
 * Metaproject Compendium
 *
 * Datasource mock
 *
 *
 *
 */

session_start();

// Initialize structures
if (!isset($_SESSION['DATA'])) {
    $_SESSION['DATA'] = array();
}


function DATA_idx($id) {
    for($i = count($_SESSION['DATA']) - 1; $i >= 0; $i--) {
        if($_SESSION['DATA'][$i]['id'] == $id) {
            return $i;
        }
    }

    return -1;
}


switch ($_SERVER['REQUEST_METHOD']) {

    case 'POST':
        $data['id'] = count($_SESSION['DATA']);
        $_SESSION['DATA'][] = $data;

        $ret = array('id' => $data['id']);
        break;
    case 'PUT':
        $idx = DATA_idx($_SERVER['PATH_INFO']);
        array_merge($_SESSION['DATA'][$idx], $_POST)

    case 'DELETE':

    case 'GET':


    default:
        throw new Exception("Invalid method");
        break;

}