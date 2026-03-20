package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.dto.CreateOrderRequest;
import com.globalshop.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/orders")
    public Result<?> create(HttpServletRequest request, @Valid @RequestBody CreateOrderRequest req) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(orderService.create(userId, req));
    }

    @GetMapping("/api/orders/{id}")
    public Result<?> getById(@PathVariable Long id) {
        return Result.success(orderService.getDetail(id));
    }

    @GetMapping("/api/users/me/orders")
    public Result<?> myOrders(HttpServletRequest request,
                              @RequestParam(defaultValue = "1") Integer page,
                              @RequestParam(defaultValue = "10") Integer size) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(orderService.getUserOrders(userId, page, size));
    }

    // Admin
    @GetMapping("/api/admin/orders")
    public Result<?> adminList(@RequestParam(defaultValue = "1") Integer page,
                               @RequestParam(defaultValue = "20") Integer size,
                               @RequestParam(required = false) String status) {
        return Result.success(orderService.adminList(page, size, status));
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public Result<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return Result.success(orderService.updateStatus(id, status));
    }
}
