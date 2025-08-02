"use client"; // ✅ Required for hooks in app router
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import LoginForm from "./LoginForm";
import { useSession, signOut } from "next-auth/react";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch } from "react-redux";
import { resetUser, updateUser } from "@/redux/userSlice";

function LoginTop() {
  const [show, setShow] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { data: session, status } = useSession(); // ✅ use status to check loading
  const dispatch = useDispatch();


  useEffect(() => {
    if (session?.user) {
      dispatch(
        updateUser({
          id: session.user.id,
          firstName: session.user.firstName || "",
          lastName: session.user.lastName || "",
          email: session.user.email || "",
          avatar: session.user.image || "",
          billing_address: session.user.billing_address || null,
          shipping_address: session.user.shipping_address || null,
        })
      );
    } else {
      dispatch(resetUser());
    }
  }, [session, dispatch]); // ✅ Watch full `session` to sync on logout too

  const handleSignOut = () => {
    dispatch(resetUser());
    signOut({ callbackUrl: "/" }); // ✅ Optional: redirect after signout
  };

  // While loading session
  if (status === "loading") return null;

  // If logged in
  if (session?.user) {
    return (
      <Dropdown>
        <Dropdown.Toggle
          variant="none"
          id="dropdown-basic"
          className="icon-container"
        >
          <Image
            src={
              imageError || !session.user.image || session.user.image === "null"
                ? "/images/customer/avatar.webp"
                : session.user.image
            }
            alt={
              session.user.firstName
                ? `${session.user.firstName} ${session.user.lastName}`
                : "User Avatar"
            }
            width={35}
            height={35}
            style={{ borderRadius: "50%" }}
            onError={() => setImageError(true)}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
          <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
          <Dropdown.Item href="/orders">Bestellungen</Dropdown.Item>
          <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  // If not logged in
  return (
    <>
      <div className="icon-container btn-top-toogle user-toogle" onClick={() => setShow(true)}>
        <Image src="/images/user-key.svg" alt="cls User" width={35} height={35} />
             <div className='white-text'>
                      <p className='big'>Account</p>
                      <p className='small'>Login / Register</p>
             </div>
      </div>
      <Modal show={show} onHide={() => setShow(false)} id="login-form">
        <Modal.Header closeButton>
          <Modal.Title>Registrierte Kunden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm />
        </Modal.Body>
      </Modal>
    </>
  );
}
export default LoginTop;
