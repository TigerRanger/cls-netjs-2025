import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { showMsg } from "@/lib/jslib/GlobalMsgControl";

import Form from 'react-bootstrap/Form';
import Image from 'next/image';
import Button from 'react-bootstrap/Button';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captcha, setCaptcha] = useState<{ image: string; token: string } | null>(null);
  const [isRotated, setIsRotated] = useState(false);
  useEffect(() => {
    fetchCaptcha(); // Fetch CAPTCHA on component mount
  }, []);
  const fetchCaptcha = async () => {
    setIsRotated((prev) => !prev); // Toggle rotation state
    const res = await fetch("/api/captcha");
    const data = await res.json();
    console.log("Fetched CAPTCHA:", data); // Debugging log
    setCaptcha(data);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      captchaAnswer,
      captchaToken: captcha?.token,
    });

    if (!result?.ok) {
      showMsg("Invalid CAPTCHA or credentials. Please try again.", "danger");
      fetchCaptcha(); // Refresh CAPTCHA on failure
    } else {
      showMsg("Login successful!", "success");
      window.location.reload(); // Refresh the page on success
    }
  };
  return (
    <div>
      <Form onSubmit={handleSubmit}>
      <Form.Control size="sm"  type="email" placeholder="Email"   value={email}  onChange={(e) => setEmail(e.target.value)} required />
      <br />
        <Form.Control size="sm" 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {captcha && (
            <>
            <div className="flex captcha_control">
            <Form.Label column sm="2">
              CAPTCHA:
            </Form.Label>
            <Image src={captcha.image} width={150} height={40} alt="CAPTCHA" />
              <div className="reload_captcha" onClick={fetchCaptcha}>
                  <Image title="Reload" className={`reloaded_captcha ${isRotated ? 'rotated' : ''}`} src="/images/reload.svg" alt="Captcha Reload" width={40} height={40} />
              </div>
            </div>
            <br/>            
            <Form.Control size="sm" 
              type="text"
              placeholder="Enter CAPTCHA"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              required
            />
        </>
        )}
        <br/>
         <Button variant="primary" type="submit">Login</Button>
      </Form>
        <br/>
      <Button variant="danger" onClick={() => signIn("google")}>
        Login With Google
      </Button>
    </div>
  );
}
