package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.entity.Refund;
import com.globalshop.mapper.RefundMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RefundController {
    private final RefundMapper refundMapper;

    @PostMapping("/api/refunds")
    public Result<Refund> apply(HttpServletRequest req, @RequestBody Refund refund) {
        Long userId = (Long) req.getAttribute("userId");
        refund.setUserId(userId);
        refund.setStatus(0);
        refundMapper.insert(refund);
        return Result.success(refund);
    }

    @GetMapping("/api/refunds/my")
    public Result<List<Refund>> myRefunds(HttpServletRequest req) {
        Long userId = (Long) req.getAttribute("userId");
        return Result.success(refundMapper.findByUserId(userId));
    }

    @GetMapping("/api/admin/refunds")
    public Result<List<Refund>> adminList() {
        return Result.success(refundMapper.selectList(null));
    }

    @PutMapping("/api/admin/refunds/{id}/handle")
    public Result<?> handle(@PathVariable Long id, @RequestBody Map<String,Object> body) {
        Refund r = refundMapper.selectById(id);
        if (r != null) {
            r.setStatus(Integer.parseInt(String.valueOf(body.get("status"))));
            r.setAdminNote(String.valueOf(body.getOrDefault("note", "")));
            refundMapper.updateById(r);
        }
        return Result.success();
    }
}
