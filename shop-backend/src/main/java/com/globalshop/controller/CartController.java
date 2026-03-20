package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public Result<?> getCart(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(cartService.getCart(userId));
    }

    @PostMapping("/add")
    public Result<?> addItem(HttpServletRequest request, @RequestBody Map<String, Object> item) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(cartService.addItem(userId, item));
    }

    @PutMapping("/update")
    public Result<?> updateItem(HttpServletRequest request,
                                @RequestParam String productId,
                                @RequestParam int quantity) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(cartService.updateItem(userId, productId, quantity));
    }

    @DeleteMapping("/clear")
    public Result<?> clearCart(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        cartService.clearCart(userId);
        return Result.success();
    }
}
