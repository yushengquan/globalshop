package com.globalshop.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.globalshop.entity.Review;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface ReviewMapper extends BaseMapper<Review> {
    @Select("SELECT * FROM reviews WHERE product_id = #{productId} AND status = 1 ORDER BY created_at DESC")
    List<Review> findByProductId(Long productId);
}
