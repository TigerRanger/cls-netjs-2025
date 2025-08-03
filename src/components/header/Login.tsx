import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import LoginForm from "./LoginForm";
import { useSession, signOut } from "next-auth/react";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch } from "react-redux";
import { resetUser, updateUser } from "@/redux/userSlice";

function Login() {
  const [show, setShow] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  // Update Redux store when session changes
  useEffect(() => {
    if (session?.user) {
      dispatch(
        updateUser({
          id: session.user.id,
          firstName: session.user.firstName || "",
          lastName: session.user.lastName || "",
          email: session.user.email || "",
          avatar: session.user.image || "",
        })
      );
    }
  }, [session?.user, dispatch]); // ✅ Fixed missing dependencies

  const handleSignOut = () => {
    dispatch(resetUser());
    signOut();
  };

  if (session) {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="none" id="dropdown-basic" className="icon-container">
          <Image
            src={imageError || !session.user.image ? "/images/customer/avatar.png" : session.user.image}
            alt={
              session.user.firstName
                ? `${session.user.firstName} ${session.user.lastName}`
                : "User Avatar"
            }
            width={35}
            height={35}
            style={{ borderRadius: "50%" }}
            onError={() => setImageError(true)} //  Handles image loading errors
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

  return (
    <>
      <div className="icon-container" onClick={() => setShow(true)}>
        <Image src="/images/user-key.svg" alt="cls User" width={35} height={35} />
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
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

export default Login;
