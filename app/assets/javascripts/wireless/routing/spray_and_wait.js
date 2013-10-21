/*
 * プロトコル概要
 * BinarySprayAndWaitプロトコルでは2つのフェイズに分かれています。
 *
 * 1. spray phase
 *  送信元はLの指定を行う。これはメッセージのコピー数である。送信元はメッセージをコピーするときに
 *  L/2の値を、宛先と自身のLに設定し直す。
 *  
 * 2. wait phase
 *  宛先がspray phaseで見つからない場合は、宛先に直接メッセージ送信を行う
 */



var SprayAndWait = function(node){
	this.node = node;
};

SprayAndWait.prototype = {

}