import { users } from "../model/data.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

//유저 관련 서비스
let userNum = users.length;

const getLocalDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  const localDateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return localDateTime;
};

//userId 유효성 조회 로직
const checkUserId = (userId) => {
  const user = users.find(
    (user) => user.userId === userId && user.deleted_at === null
  );
  if (!user) {
    return false;
  }
  return true;
};

export const checkUser = (userId) => {
  const user = users.find(
    (user) => user.userId === userId && user.deleted_at === null
  );
  return user;
};

export const checkUserNickname = (nickname) => {
  const user = users.find(
    (user) => user.nickname === nickname && user.deleted_at === null
  );
  if (user) {
    return true;
  }
  return false;
};

export const checkUserEmail = (email) => {
  const user = users.find(
    (user) => user.email === email && user.deleted_at === null
  );
  if (user) {
    return true;
  }
  return false;
};

//유저 등록 로직
const registerUser = (data) => {
  //data 형식: { email, nickname, password, profile_image }
  const userId = userNum + 1;
  const date = getLocalDateTime();
  const newUser = {
    userId,
    email: data.email,
    nickname: data.nickname,
    password: data.password,
    profile_image: data.profile_image,
    created_at: date,
    updated_at: date,
    deleted_at: null,
  };

  users.push(newUser);
  userNum += 1;
  return userId;
};

//유저 로그인 로직 -> 유저 아이디 반환
const logInUser = (email, password) => {
  const user = users.find(
    (user) => user.email === email && user.deleted_at === null
  );
  if (!user) {
    return null;
  }
  if (user.password !== password) {
    return null;
  }
  return user;
};

//유저 정보 수정 로직
const updateUserProfile = (data) => {
  if (!data.nickname && !data.profile_image) {
    return false;
  }
  if (data.nickname) {
    users[data.userId - 1].nickname = data.nickname;
  }
  if (data.profile_image) {
    users[data.userId - 1].profile_image = data.profile_image;
  }
  return data.userId;
};

//유저 비밀번호 수정 로직
const updateUserPassword = (data) => {
  if (!data.userId || !data.password) {
    return false;
  }
  users[data.userId - 1].password = data.password;
  return true;
};

//유저 회원탈퇴 로직
const eraseUser = (id) => {
  if (!id) {
    return false;
  }
  const user = checkUserId(id);
  if (!user) {
    return false;
  }

  const date = getLocalDateTime();
  users[id - 1].deleted_at = date;
  return true;
};

//이미지 저장
const postImage = (image) => {
  const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).json({ error: "Invalid image data" });
  }

  // 이미지 데이터를 Buffer로 디코딩
  const imageBuffer = Buffer.from(matches[2], "base64");

  // 이미지를 서버에 저장
  const imageName = `profile_image_${Date.now()}.png`; // 파일명 생성
  const imagePath = path.join(__dirname, "/images/profile", imageName);
  fs.writeFile(imagePath, imageBuffer, (err) => {
    if (err) {
      console.error("Error saving image:", err);
    } else {
      console.log("Image saved successfully");
    }
  });

  const imageUrl = `http://localhost:8000/images/profile/${imageName}`;
  return imageUrl;
};

//--------------------------------------------------------
//실제 user controller
const getUserList = (req, res) => {
  //TODO: 서버로 띄울 시 활셩화 필요
  // users.forEach((user) => {
  //   user.profile_image = user.profile_image.replace(
  //     "http://localhost:8000",
  //     `https://${req.headers.host}`
  //   );
  // });
  res.json(users);
  return;
};

const getUser = (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    res
      .status(400)
      .json({ status: 404, message: "invalid_user_id", data: null });
  }

  const user = checkUser(userId);

  if (!user) {
    res
      .status(404)
      .json({ status: 404, message: "not_fount_user", data: null });
  }

  //TODO: 서버로 띄울 시 활셩화 필요
  // user.profile_image = user.profile_image.replace(
  //   "http://localhost:8000",
  //   `https://${req.headers.host}`
  // );

  if (user) {
    res.status(200).json({ status: 200, message: null, data: user });
  }
  return;
};

const postUser = (req, res) => {
  const email = req.body.email;
  const nickname = req.body.nickname;
  const password = req.body.password;
  const profile_image = req.body.profile_image;
  let profile_server_url = "";

  if (!email || !nickname || !password || !profile_image) {
    res.status(400).json({ status: 404, message: "invalid_input", data: null });
  }

  if (profile_image) {
    profile_server_url = postImage(profile_image);
  }

  const newUserId = registerUser({
    email,
    nickname,
    password,
    profile_image: profile_server_url,
  });

  if (!newUserId) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
    return;
  }

  res.status(201).json({
    status: 201,
    message: "register_success",
    data: { userId: newUserId, profile_image },
  });

  return;
};

const postLongIn = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    res
      .status(400)
      .json({ status: 400, message: "required_email", data: null });
  }

  const user = logInUser(email, password);

  if (!user) {
    res
      .status(401)
      .json({ status: 401, message: "invalid_email_or_password", data: null });
  }

  res.status(200).json({ status: 200, message: "login_success", data: user });

  return;
};

const patchUserInfo = (req, res) => {
  const userId = Number(req.params.userId);
  const nickname = req.body.nickname;
  const profile_image = req.body.profile_image;
  let user_server_url = "";

  if (!userId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
    return;
  }

  if (!profile_image.includes(req.headers.host)) {
    user_server_url = postImage(profile_image);
  } else {
    user_server_url = profile_image.replace(
      req.headers.host,
      "http://localhost:8080"
    );
  }

  if (!checkUserId(userId)) {
    res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
    return;
  }

  if (!checkUserId(userId) && !profile_image) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
    return;
  }

  const success = updateUserProfile({
    userId,
    nickname,
    profile_image: user_server_url,
  });

  if (!success) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
    return;
  }

  res
    .status(201)
    .json({ status: 201, message: "update_user_data_success", data: success });

  return;
};

const patchUserPassword = (req, res) => {
  const userId = Number(req.params.userId);
  const password = req.body.password;

  if (!userId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }

  if (!password) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_password", data: null });
  }

  if (!checkUserId(userId)) {
    res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
  }

  const success = updateUserPassword({ userId, password });
  if (!success) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }
  res.status(201).json({
    status: 201,
    message: "change_user_password_success",
    data: null,
  });

  return;
};

const deleteUser = (req, res) => {
  const userId = Number(req.params.id);

  if (!userId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
    return;
  }

  if (!checkUserId(userId)) {
    res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
    return;
  }

  const isSuccess = eraseUser(userId);

  if (isSuccess) {
    res
      .status(200)
      .json({ status: 200, message: "delete_user-data_success", data: null });
    return;
  }

  return;
};

const duplicateEmail = (req, res) => {
  const email = req.params.email;

  const isExist = checkUserEmail(email);

  if (isExist) {
    res
      .status(400)
      .json({ status: 400, message: "already_exist_email", data: null });
  }

  res.status(200).json({ status: 200, message: "available_email", data: null });
  return;
};

const duplicateNickname = (req, res) => {
  const nickname = req.params.nickname;
  const userId = Number(req.body.userId) ?? null;

  if (userId) {
    const user = checkUser(userId);
    if (user.nickname === nickname) {
      res
        .status(200)
        .json({ status: 200, message: "same_nickname", data: null });
      return;
    }
  }

  const isExist = checkUserNickname(nickname);

  if (isExist) {
    res
      .status(400)
      .json({ status: 400, message: "already_exist_nickname", data: null });
    return;
  }

  res
    .status(200)
    .json({ status: 200, message: "available_nickname", data: null });
  return;
};

export const userController = {
  getUserList,
  getUser,
  postUser,
  postLongIn,
  patchUserInfo,
  patchUserPassword,
  deleteUser,
  duplicateEmail,
  duplicateNickname,
  postImage,
};
