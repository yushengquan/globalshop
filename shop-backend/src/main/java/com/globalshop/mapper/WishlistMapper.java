package com.globalshop.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.globalshop.entity.Wishlist;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Delete;
import java.util.List;

@Mapper
public interface WishlistMapper extends BaseMapper<Wishlist> {
    @Select("SELECT * FROM wishlists WHERE user_id = #{userId}")
    List<Wishlist> findByUserId(Long userId);

    @Delete("DELETE FROM wishlists WHERE user_id = #{userId} AND product_id = #{productId}")
    void deleteByUserAndProduct(Long userId, Long productId);

    @Select("SELECT COUNT(*) FROM wishlists WHERE user_id = #{userId} AND product_id = #{productId}")
    int existsByUserAndProduct(Long userId, Long productId);
}
