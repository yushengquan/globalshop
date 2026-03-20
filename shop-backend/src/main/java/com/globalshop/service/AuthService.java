package com.globalshop.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.globalshop.config.JwtUtil;
import com.globalshop.dto.LoginRequest;
import com.globalshop.dto.RegisterRequest;
import com.globalshop.entity.User;
import com.globalshop.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Map<String, Object> register(RegisterRequest req) {
        LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();
        qw.eq(User::getEmail, req.getEmail());
        if (userMapper.selectOne(qw) != null) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setRole("CUSTOMER");
        user.setStatus("ACTIVE");
        userMapper.insert(user);
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", Map.of("id", String.valueOf(user.getId()), "email", user.getEmail(),
                "firstName", user.getFirstName(), "role", user.getRole()));
        return result;
    }

    public Map<String, Object> login(LoginRequest req) {
        LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();
        qw.eq(User::getEmail, req.getEmail());
        User user = userMapper.selectOne(qw);
        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new RuntimeException("Account is " + user.getStatus().toLowerCase());
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", Map.of("id", String.valueOf(user.getId()), "email", user.getEmail(),
                "firstName", user.getFirstName(), "role", user.getRole()));
        return result;
    }
}
