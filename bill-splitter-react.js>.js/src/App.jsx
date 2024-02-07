import { useState } from "react";

/* eslint-disable react/prop-types */
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setfriend] = useState(initialFriends);
  const [addfriend, setAddfriend] = useState(false);
  const [selectedfriend, setSelectedfriend] = useState(null);
  function addfreindhandlerer() {
    setAddfriend((i) => !i);
  }
  function setfriendshandlerer(newfriend) {
    setfriend((friends) => [...friends, newfriend]);
    setAddfriend(false);
  }

  function setSelectedfriendhandlerer(friends) {
    setSelectedfriend((cur) => (cur?.id === friends.id ? null : friends));
    setAddfriend(false);
  }

  function onSubmithandlerer(value) {
    setfriend(
      friends.map((friend) =>
        friend.id === selectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedfriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelect={setSelectedfriendhandlerer}
          friendssplit={selectedfriend}
        />
        {addfriend && (
          <FormAddFriend onAddfriends={setfriendshandlerer} onClick={friends} />
        )}
        <Button onClick={addfreindhandlerer}>
          {!addfriend ? "Add friend" : "Close"}
        </Button>
      </div>
      {selectedfriend && (
        <FormSplit
          friendssplit={selectedfriend}
          onSubmit={onSubmithandlerer}
          key={selectedfriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelect, friendssplit }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          friendssplit={friendssplit}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, friendssplit }) {
  const isSelected = friendssplit?.id === friend.id;
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddfriends }) {
  const [name, setname] = useState("");
  const [image, setimage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();

    const newfriend = {
      name,
      image: `${"https://i.pravatar.cc/48"}?=${id}`,
      balance: 0,
      id,
    };

    onAddfriends(newfriend);

    setimage("https://i.pravatar.cc/48");
    setname("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯Friend name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />

      <label>🌄Image URL:</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      />

      <Button onClick={onAddfriends}>Add</Button>
    </form>
  );
}

function FormSplit({ friendssplit, onSubmit }) {
  const [bill, setBill] = useState("");
  const [expenses, setExpenses] = useState("");
  const friendExpenses = bill ? bill - expenses : "";
  const [whopays, setWhoupays] = useState("user");

  function onSubmit2(e) {
    e.preventDefault;

    if (!bill || !expenses) return;

    onSubmit(whopays === "user" ? friendExpenses : -friendExpenses);
  }
  return (
    <form className="form-split-bill" onSubmit={onSubmit2}>
      <h2>split a bill with {friendssplit.name}</h2>

      <label>💸Bill value:</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>💰Your expenses:</label>
      <input
        type="text"
        value={expenses}
        onChange={(e) =>
          setExpenses(
            Number(e.target.value) > bill ? expenses : Number(e.target.value)
          )
        }
      />
      <label>🧍🏼‍♂️{friendssplit.name} expenses:</label>
      <input type="text" disabled value={friendExpenses} />
      <label>💲Who is paying the bill?</label>
      <select value={whopays} onChange={(e) => setWhoupays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friendssplit.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
