package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.mapper.OrderMapper;
import com.globalshop.mapper.ProductMapper;
import com.globalshop.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final OrderMapper orderMapper;
    private final ProductMapper productMapper;
    private final UserMapper userMapper;

    @GetMapping("/overview")
    public Result<Map<String,Object>> overview() {
        Map<String,Object> data = new LinkedHashMap<>();
        data.put("totalOrders", orderMapper.selectCount(null));
        data.put("totalProducts", productMapper.selectCount(null));
        data.put("totalUsers", userMapper.selectCount(null));
        data.put("pendingOrders", orderMapper.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.globalshop.entity.Order>().eq("status", "PENDING")));
        return Result.success(data);
    }
}
