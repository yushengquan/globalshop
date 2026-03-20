package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.entity.Review;
import com.globalshop.mapper.ReviewMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewMapper reviewMapper;

    @GetMapping("/api/products/{productId}/reviews")
    public Result<List<Review>> getReviews(@PathVariable Long productId) {
        return Result.success(reviewMapper.findByProductId(productId));
    }

    @PostMapping("/api/reviews")
    public Result<Review> createReview(HttpServletRequest request, @RequestBody Review review) {
        Long userId = (Long) request.getAttribute("userId");
        review.setUserId(userId);
        review.setStatus(1);
        reviewMapper.insert(review);
        return Result.success(review);
    }

    @GetMapping("/api/admin/reviews")
    public Result<List<Review>> adminList() {
        return Result.success(reviewMapper.selectList(null));
    }

    @PutMapping("/api/admin/reviews/{id}/reply")
    public Result<?> reply(@PathVariable Long id, @RequestBody Map<String,String> body) {
        Review r = reviewMapper.selectById(id);
        if (r != null) {
            r.setReply(body.get("reply"));
            reviewMapper.updateById(r);
        }
        return Result.success();
    }
}
