package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.entity.Wishlist;
import com.globalshop.mapper.WishlistMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistMapper wishlistMapper;

    @GetMapping
    public Result<List<Wishlist>> getWishlist(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(wishlistMapper.findByUserId(userId));
    }

    @PostMapping("/add")
    public Result<?> add(HttpServletRequest request, @RequestBody Map<String,Object> body) {
        Long userId = (Long) request.getAttribute("userId");
        Long productId = Long.parseLong(String.valueOf(body.get("productId")));
        if (wishlistMapper.existsByUserAndProduct(userId, productId) == 0) {
            Wishlist w = new Wishlist();
            w.setUserId(userId);
            w.setProductId(productId);
            wishlistMapper.insert(w);
        }
        return Result.success();
    }

    @DeleteMapping("/remove")
    public Result<?> remove(HttpServletRequest request, @RequestParam Long productId) {
        Long userId = (Long) request.getAttribute("userId");
        wishlistMapper.deleteByUserAndProduct(userId, productId);
        return Result.success();
    }

    @GetMapping("/check")
    public Result<Boolean> check(HttpServletRequest request, @RequestParam Long productId) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(wishlistMapper.existsByUserAndProduct(userId, productId) > 0);
    }
}
