type HeaderProps = {
  balance: number;
};

export function Header({ balance }: HeaderProps) {
  return (
    <header className="header">
      <div className="brand">
        <h1>Trading App MVP</h1>
        <small>Paper trading dashboard</small>
      </div>
      <div className="account-box">
        <div className="balance-pill">Balance: ${balance.toFixed(2)}</div>
      </div>
    </header>
  );
}
