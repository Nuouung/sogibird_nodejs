const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

// 인증 과정
// 1. 라우터를 통해 로그인 요청 들어옴
// 2. 라우터에서 passport.authenticate 메소드 호출
// 3. 로그인 전략 수행
// 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
// 5. req.login 메소드가 passport.serializeUser 호출
// 6. req.session에 사용자 데이터 저장
// 7. 로그인 완료

// 인가 과정
// 1. 요청 들어옴
// 2. 라우터에 요청이 도달하기 전, passport.session 미들웨어가 passport.deserializeUser 메소드 호출
// 3. req.session(쿠키인가?)에 저장된 아이디로 데이터베이스에서 사용자 조회
// 4. 조회된 사용자 정보 req.user에 저장
// 5. 라우터에서 req.user 객체 사용 가능

module.exports = () => {
    // 로그인 시 실행
    passport.serializeUser((user, done) => {
        // req.session 객체에 정보 바인딩
        done(null, user.id); // 실패 시 첫번째 인자, 성공 시 두번째 인자 삽입
    });

    // 매 요청 시 실행
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
            .then(user => done(null, user)) // 조회 성공 시 req.user에 두 번째 인자 삽입 (실패 시 첫번째 인자)
            .catch(err => done(err));
    });

    local();
    kakao();
}