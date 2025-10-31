pragma solidity ^0.8.0;

// توجه: این کانترکت از تصادفی سازی ناامن (block.timestamp) استفاده می کند و فقط برای اهداف آموزشی است.

contract DiceGame {
    // 0: Under 7, 1: Over 7
    enum Guess { UNDER, OVER }

    address public owner;

    // سازنده: هنگام دیپلوی اجرا می شود
    constructor() payable {
        owner = msg.sender;
    }

    // امکان دریافت ETH برای تامین بودجه کانترکت
    receive() external payable {}

    // تابع اصلی برای شرط بندی و حدس
    function guess(Guess _guess) public payable {
        // Bet must be greater than zero
        require(msg.value > 0, "Bet must be greater than zero.");
        // مطمئن شوید که کانترکت توانایی پرداخت جایزه (2x) را دارد
        require(address(this).balance >= msg.value * 2, "Contract does not have enough funds to cover the potential payout.");

        // --- تولید عدد تصادفی ناامن ---
        uint256 randomSeed = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.difficulty)));

        // شبیه سازی پرتاب دو تاس (هر کدام 1 تا 6)
        uint256 dice1 = (randomSeed % 6) + 1;
        uint256 dice2 = ((randomSeed / 6) % 6) + 1;
        uint256 total = dice1 + dice2; // مجموع نهایی

        bool won = false;
        // ضریب پرداخت 2x (سود 1x)
        uint256 payout = msg.value * 2;

        // شرط برد: اگر مجموع مساوی 7 نباشد
        if (total != 7) {
            // حدس Under (کمتر از 7): مجموع باید < 7 باشد
            if (_guess == Guess.UNDER && total < 7) {
                won = true;
            }
            // حدس Over (بیشتر از 7): مجموع باید > 7 باشد
            else if (_guess == Guess.OVER && total > 7) {
                won = true;
            }
        }

        // اگر برنده شد، جایزه را پرداخت کن
        if (won) {
            (bool success, ) = msg.sender.call{value: payout}("");
            require(success, "Payout failed.");
        }
    }

    // برداشت موجودی کانترکت (فقط توسط مالک)
    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw.");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed.");
    }
}
