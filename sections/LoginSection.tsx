export default function LoginSection() {
  return (
    <div className="container">
      <div className="logo-box">
        <img src="image.png" alt="Logo" className="logo" />
      </div>
      <div className="message-box">
        <h1>OUTBOX Testn</h1>
        <a href="/login" className="button">Login</a>
      </div>
      <style jsx>
        {`
        body {
          background-color: rgba(139, 0, 4, 0.8); 
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 0 10px;
        }

        .logo-box {
          margin-bottom: 30px;
          margin-top: -100px;
        }

        .logo {
          max-width: 200px;
          display: block;
          margin-left: auto;
          margin-right: auto;
          margin-top: -50px;
          border-radius: 14px;
        }

        .message-box {
          text-align: center;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 640px;
          width: 100%;
        }

        .message-box h1 {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #000000;
        }

        .button {
          color: #ffffff;
          background-color: #2D2D2D;
          padding: 12px 2px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          width: calc(100% - 16px);
          text-align: center;
          margin-bottom: 12px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #3C0F15;
        }

        .button:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(253, 224, 71, 0.5);
        }
      `}
      </style>
    </div>
  );
}
