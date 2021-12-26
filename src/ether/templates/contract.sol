pragma solidity ^0.4.4;

contract Token {
    function totalSupply() constant returns (uint256 supply) {}
    function getBalance(address _owner) constant returns (uint256 balance) {}
    function transfer(address _to, uint256 _value) returns (bool success) {}
    function transferFrom(address _to, address _from, uint256 _value) returns (bool success) {}
    function approve(address _spender, uint256 _value) returns (bool success) {}
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {}

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract Standard is Token {
    function transfer(address _to, uint256 _value) returns (bool success) {
        if(balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= value;
            balances[_to] += value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else {return false;}
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if(balances[_from] >= value && allowed[_from][msg.sender] >= _value && _value > 0) {
            balances[_from] -= value;
            balances[_to] += value;
            allowed[_from][msg.sender] -= _value;
            Transfer(_from, _to, _value);
            return true;
        } else {return false;}
    }

    function getBalance(address _owner) constant returns (uint256 balance) {return balances[_owner];}
    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {return allowed[_owner][_spender];}

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;
    uint256 public totalSupply;
}

contract SchoolToken is Standard {
    function () {throw;}

    string public name;
    string public symbol;
    uint8 public decimals;
    string public version = 'V1.0';

    function SchoolToken() {
        balances[msg.sender] = 100000;
        totalSupply = 100000;
        name = "__name__";
        symbol = "__symbol__";
        decimals = 18;
    }

    function ApproveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);

        if(!_spender.call(bytes4(bytes32(sha3("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData)) { throw; }
        return true;
    }
}