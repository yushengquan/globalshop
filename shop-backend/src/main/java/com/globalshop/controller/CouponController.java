package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.entity.Coupon;
import com.globalshop.mapper.CouponMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CouponController {
    private final CouponMapper couponMapper;

    @PostMapping("/api/coupons/validate")
    public Result<?> validate(@RequestBody Map<String,String> body) {
        Coupon c = couponMapper.findValidByCode(body.get("code"));
        if (c == null) return Result.error(400, "Invalid or expired coupon");
        return Result.success(Map.of(
            "code", c.getCode(),
            "type", c.getType(),
            "value", c.getValue(),
            "minAmount", c.getMinAmount()
        ));
    }

    @GetMapping("/api/admin/coupons")
    public Result<List<Coupon>> list() {
        return Result.success(couponMapper.selectList(null));
    }

    @PostMapping("/api/admin/coupons")
    public Result<Coupon> create(@RequestBody Coupon coupon) {
        couponMapper.insert(coupon);
        return Result.success(coupon);
    }
}
