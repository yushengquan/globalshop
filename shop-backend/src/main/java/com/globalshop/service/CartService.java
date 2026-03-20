package com.globalshop.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CartService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private String key(Long userId) {
        return "cart:" + userId;
    }

    public List<Map<String, Object>> getCart(Long userId) {
        String json = redisTemplate.opsForValue().get(key(userId));
        if (json == null) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public List<Map<String, Object>> addItem(Long userId, Map<String, Object> item) {
        List<Map<String, Object>> cart = getCart(userId);
        String productId = String.valueOf(item.get("productId"));
        Optional<Map<String, Object>> existing = cart.stream()
                .filter(i -> productId.equals(String.valueOf(i.get("productId"))))
                .findFirst();
        if (existing.isPresent()) {
            int qty = (int) existing.get().getOrDefault("quantity", 1);
            existing.get().put("quantity", qty + (int) item.getOrDefault("quantity", 1));
        } else {
            cart.add(item);
        }
        saveCart(userId, cart);
        return cart;
    }

    public List<Map<String, Object>> updateItem(Long userId, String productId, int quantity) {
        List<Map<String, Object>> cart = getCart(userId);
        if (quantity <= 0) {
            cart.removeIf(i -> productId.equals(String.valueOf(i.get("productId"))));
        } else {
            cart.stream().filter(i -> productId.equals(String.valueOf(i.get("productId"))))
                    .findFirst().ifPresent(i -> i.put("quantity", quantity));
        }
        saveCart(userId, cart);
        return cart;
    }

    public void clearCart(Long userId) {
        redisTemplate.delete(key(userId));
    }

    private void saveCart(Long userId, List<Map<String, Object>> cart) {
        try {
            redisTemplate.opsForValue().set(key(userId), objectMapper.writeValueAsString(cart), 7, TimeUnit.DAYS);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save cart");
        }
    }
}
